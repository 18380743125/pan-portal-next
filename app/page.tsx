'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AppFC() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/') {
      router.replace('/list-page/files')
    }
  }, [])

  return <></>
}
