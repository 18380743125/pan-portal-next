import { PayloadAction } from '@reduxjs/toolkit'

import { getUserInfoApi, loginApi } from '@/api/modules/user'
import { createAppSlice } from '@/lib/store/createAppSlice'
import { localCache } from '@/lib/utils/cache.util'
import { CacheEnum } from '@/lib/constants'
import { User } from '@/types/user'

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
  reducers: create => ({
    // 缓存token
    setToken: create.reducer((state, action: PayloadAction<string>) => {
      state.token = action.payload
      localCache.setCache(CacheEnum.USER_TOKEN, action.payload)
    }),

    // 缓存用户信息
    setUserInfo: create.reducer((state, action: PayloadAction<Record<string, any>>) => {
      state.userInfo = action.payload
      localCache.setCache(CacheEnum.USER_INFO, action.payload)
    }),

    // 登陆action
    loginAction: create.asyncThunk(async (data: User.LoginParams, { dispatch }) => {
      const result = await loginApi(data)
      dispatch(setToken(result))
      return result
    }),

    // 获取用户信息action
    getUserAction: create.asyncThunk(async (_, { dispatch }) => {
      const result = await getUserInfoApi()
      dispatch(setUserInfo(result))
    }),

    // 清除redux数据
    clearUserAction: create.reducer(state => {
      state.userInfo = {}
      state.token = ''
      localCache.clear()
    })
  })
})

export const { setToken, setUserInfo, loginAction, getUserAction, clearUserAction } = userSlice.actions

export default userSlice
