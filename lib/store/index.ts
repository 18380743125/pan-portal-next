import { combineSlices, configureStore } from '@reduxjs/toolkit'

import userSlice from '@/lib/store/features/userSlice'
import fileSlice from '@/lib/store/features/fileSlice'

// combineSlices 自动组合使用的reducer
// 它们的 reducerPath, 因此我们不再需要调用 combineReducers
const rootReducer = combineSlices(userSlice, fileSlice)

// 创建一个的 store 根实例
// 在 SSR 中, 每个请求都需要单独的存储实例, 以防止交叉请求状态污染
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer
  })
}

// 推断 makeStore 的返回值类型
export type AppStore = ReturnType<typeof makeStore>

// 从 rootReducer 中推断 RootState 的类型
export type RootState = ReturnType<AppStore['getState']>

// 推断 AppDispatch 的类型
export type AppDispatch = AppStore['dispatch']
