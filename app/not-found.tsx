'use client'

import { Button, Result } from 'antd'
import { useRouter } from 'next/navigation'

function NotFound() {
  const router = useRouter()

  const handleClick = () => {
    router.replace('/')
  }

  return (
    <Result
      status={404}
      title='404'
      subTitle='抱歉，您访问的页面不存在。'
      extra={
        <Button onClick={handleClick}>
          回到首页
        </Button>
      }
    />
  )
}

export default NotFound
