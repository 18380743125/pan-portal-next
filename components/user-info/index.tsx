import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown } from 'antd'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useEffect } from 'react'
import { getUserAction } from '@/lib/store/features/userSlice'

import styles from './styles.module.scss'

const Breadcrumb = () => {
  const { userInfo } = useAppSelector(
    state => ({
      userInfo: state.user.userInfo
    }),
    shallowEqualApp
  )

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getUserAction())
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
      <a onClick={e => e.preventDefault()}>
        <span className={styles.username}>{userInfo?.username}</span>
        <DownOutlined />
      </a>
    </Dropdown>
  )
}

export default Breadcrumb
