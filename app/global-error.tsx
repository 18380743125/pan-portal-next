'use client'

import { Button, Result } from 'antd'
import { useRouter } from 'next/navigation'

function Forbidden() {
  const router = useRouter()
  const handleClick = () => {
    router.replace('/')
  }

  return (
    <Result
      status={403}
      title='403'
      subTitle='抱歉，发生了一点错误~'
      extra={<Button onClick={handleClick}>回到首页</Button>}
    />
  )
}

export default Forbidden
