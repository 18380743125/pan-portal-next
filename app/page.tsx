'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AppFC() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/list-page/files')
  }, [])

  return <></>
}
