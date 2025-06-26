import { combineSlices, configureStore } from '@reduxjs/toolkit'

import fileSlice from '@/lib/store/features/fileSlice'
import taskSlice from '@/lib/store/features/taskSlice'
import userSlice from '@/lib/store/features/userSlice'

const rootReducer = combineSlices(userSlice, fileSlice, taskSlice)

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']
