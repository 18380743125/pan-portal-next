'use client'

import { useEffect } from 'react'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { getUserAction } from '@/lib/store/features/userSlice'

export default function ListPageLayout({ children }) {
  const dispatch = useAppDispatch()

  const { userInfo } = useAppSelector(
    state => ({
      userInfo: state.user.userInfo
    }),
    shallowEqualApp
  )

  console.log(userInfo)

  useEffect(() => {
    dispatch(getUserAction())
  }, [])

  return <>{children}</>
}
