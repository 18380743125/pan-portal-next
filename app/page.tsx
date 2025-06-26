'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

function App() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/') {
      router.replace('/list-page/files')
    }
  }, [])

  return <></>
}

export default App
