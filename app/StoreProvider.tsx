'use client'

import { useRef, type ReactNode } from 'react'
import { Provider } from 'react-redux'

import type { AppStore } from '@/lib/store'
import { makeStore } from '@/lib/store'

interface Props {
  readonly children: ReactNode
}

export const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current!}>{children}</Provider>
}
