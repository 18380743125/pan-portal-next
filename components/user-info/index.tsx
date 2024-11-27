'use client'

import { useEffect, useState } from 'react'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { getUserAction } from '@/lib/store/features/userSlice'

import styles from './styles.module.scss'

const UserInfoFC = () => {
  const [isClient, setIsClient] = useState(false)
  const { userInfo } = useAppSelector(
    state => ({
      userInfo: state.user.userInfo
    }),
    shallowEqualApp
  )

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getUserAction())
    setIsClient(true)
  }, [])

  const items: MenuProps['items'] = [
    {
      label: (
        <a target='_blank' rel='noopener noreferrer' href='https://www.antgroup.com'>
          1st menu item
        </a>
      ),
      key: '0'
    }
  ]

  return (
    <Dropdown menu={{ items }} className={styles.root}>
      <a>
        <span className={styles.username} suppressHydrationWarning={true}>
          {isClient ? userInfo?.username : '-'}
        </span>
        <DownOutlined style={{ position: 'relative', top: 1 }} />
      </a>
    </Dropdown>
  )
}

export default UserInfoFC
