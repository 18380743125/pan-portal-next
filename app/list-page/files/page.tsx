'use client'

import { Button } from 'antd'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div>
      <Button type='primary' onClick={() => router.push('/list-page/docs')}>
        files
      </Button>
    </div>
  )
}
