'use client'

import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import UpdatePassword from '@/components/user-info/update-password'

import { logoutApi } from '@/api/features/user'
import { modal } from '@/lib/AntdGlobal'
import { useUserStore } from '@/lib/store/userStore'

import styles from './styles.module.scss'

const UserInfoFC = () => {
  const router = useRouter()
  const updatePasswordRef = useRef<{ open: (flag: boolean) => void } | null>(null)
  const [isClient, setIsClient] = useState(false)

  const { userInfo, getUserAction, clearUserAction } = useUserStore()

  useEffect(() => {
    getUserAction()
    setIsClient(true)
  }, [])

  // 退出登陆
  const onLogout = () => {
    modal.confirm({
      title: '提示',
      content: '确定要退出登陆吗? ',
      icon: <ExclamationCircleFilled />,
      async onOk() {
        await logoutApi()
        router.replace('/login')
        clearUserAction()
      },
      onCancel() {}
    })
  }

  // 修改密码
  const onUpdatePassword = () => {
    updatePasswordRef.current?.open(true)
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <div onClick={onUpdatePassword} style={{ padding: '4px 16px' }}>
          修改密码
        </div>
      ),
      key: 'update_password'
    },
    {
      label: (
        <div onClick={onLogout} style={{ padding: '4px 16px' }}>
          退出登陆
        </div>
      ),
      key: 'logout'
    }
  ]

  return (
    <>
      <UpdatePassword ref={updatePasswordRef} />

      <Dropdown menu={{ items }} placement='bottom' arrow={{ pointAtCenter: true }} className={styles.root}>
        <a>
          <span className={styles.username} suppressHydrationWarning={true}>
            {isClient ? userInfo?.username : '-'}
          </span>
          <DownOutlined style={{ position: 'relative', top: 2 }} />
        </a>
      </Dropdown>
    </>
  )
}

export default UserInfoFC
