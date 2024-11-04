import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, AppStore, RootState } from '.'

export const useAppStore = useStore.withTypes<AppStore>()

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export const useAppSelector = useSelector.withTypes<RootState>()

export const shallowEqualApp = shallowEqual
