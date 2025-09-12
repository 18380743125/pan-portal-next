import { create } from 'zustand'
import { createJSONStorage, persist, type PersistStorage } from 'zustand/middleware'

import { getUserInfoApi, loginApi } from '@/api/features/user'
import type { User } from '@/types/user'
import { useFileStore } from './fileStore'

interface UserState {
  token: string

  userInfo: Record<string, any>
}

interface UserAction {
  clearUserAction: () => void

  getUserAction: () => void

  loginAction: (payload: User.LoginParams) => Promise<Record<string, any>>
}

const storage = createJSONStorage(() => localStorage) as PersistStorage<UserState & UserAction>

export const useUserStore = create<UserState & UserAction>()(
  persist(
    set => ({
      token: '',
      userInfo: {},

      // 登陆
      async loginAction(payload) {
        const result = await loginApi(payload)
        set({ token: result })
        return result
      },
      // 获取用户信息
      async getUserAction() {
        const result = await getUserInfoApi()
        if (result.rootFileId) {
          set({ userInfo: result })
          const initBreadcrumbList = [
            {
              id: result.rootFileId,
              name: result.rootFilename,
              parentId: result.rootFileId
            }
          ]
          useFileStore.getState().setBreadcrumbList(initBreadcrumbList)
        }
      },
      // 清除状态和缓存
      clearUserAction() {
        set({
          token: '',
          userInfo: {}
        })
        storage.removeItem('user-store')
      }
    }),
    {
      name: 'user-store',
      storage: storage
    }
  )
)
