import { type PayloadAction } from '@reduxjs/toolkit'

import { getUserInfoApi, loginApi } from '@/api/features/user'
import { CacheEnum } from '@/lib/constants/base'
import { createAppSlice } from '@/lib/store/createAppSlice'
import { setBreadcrumbList } from '@/lib/store/features/fileSlice'
import { localCache } from '@/lib/utils/common/cache'
import { type User } from '@/types/user'

interface IState {
  token: string
  userInfo: Record<string, any>
}

const userSlice = createAppSlice({
  name: 'user',
  initialState: {
    token: localCache.getCache(CacheEnum.USER_TOKEN),
    userInfo: localCache.getCache(CacheEnum.USER_INFO)
  } as IState,
  reducers: ({ reducer, asyncThunk }) => ({
    // 缓存 token
    setToken: reducer((state, action: PayloadAction<string>) => {
      state.token = action.payload
      localCache.setCache(CacheEnum.USER_TOKEN, action.payload)
    }),

    // 缓存用户信息
    setUserInfo: reducer((state, action: PayloadAction<Record<string, any>>) => {
      state.userInfo = action.payload
      localCache.setCache(CacheEnum.USER_INFO, action.payload)
    }),

    // 登陆action
    loginAction: asyncThunk(async (data: User.LoginParams, { dispatch, rejectWithValue }) => {
      try {
        const result = await loginApi(data)
        dispatch(setToken(result))
        return result
      } catch (err) {
        return rejectWithValue(err)
      }
    }),

    // 获取用户信息action
    getUserAction: asyncThunk(async (_, { dispatch }) => {
      const result = await getUserInfoApi()
      if (result.rootFileId) {
        dispatch(setUserInfo(result))
        const initBreadcrumbList = [
          {
            id: result.rootFileId,
            name: result.rootFilename,
            parentId: result.rootFileId
          }
        ]
        dispatch(setBreadcrumbList({ list: initBreadcrumbList }))
      }
    }),

    // 清除redux数据
    clearUserAction: reducer(state => {
      state.userInfo = {}
      state.token = ''
      localCache.removeCache(CacheEnum.USER_TOKEN)
      localCache.removeCache(CacheEnum.USER_INFO)
    })
  })
})

export const { setToken, setUserInfo, loginAction, getUserAction, clearUserAction } = userSlice.actions

export default userSlice
