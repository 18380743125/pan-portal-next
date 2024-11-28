'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function ListPageFc() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/list-page') {
      router.replace('/list-page/files')
    }
  }, [])

  return <></>
}
