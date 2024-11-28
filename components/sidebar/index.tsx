'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import classNames from 'classnames'
import { FolderOutlined, ShareAltOutlined, DeleteOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const index = navList.findIndex(item => item.path === pathname)
    setActiveIndex(index)
  }, [])

  const navList = [
    {
      label: '全部文件',
      icon: <FolderOutlined />,
      path: '/list-page/files'
    },
    {
      label: '图片',
      icon: null,
      path: '/list-page/images'
    },
    {
      label: '文档',
      icon: null,
      path: '/list-page/docs'
    },
    {
      label: '视频',
      icon: null,
      path: '/list-page/videos'
    },
    {
      label: '音乐',
      icon: null,
      path: '/list-page/musics'
    },
    {
      label: '我的分享',
      icon: <ShareAltOutlined />,
      path: '/list-page/shares'
    },
    {
      label: '回收站',
      icon: <DeleteOutlined />,
      path: '/list-page/recycles'
    }
  ]

  const onNavItemClick = (index: number, path: string) => {
    setActiveIndex(index)
    router.push(path)
  }

  return (
    <section className={styles.root}>
      <ul className={styles.nav}>
        {navList.map((item, index) => (
          <li
            key={item.path}
            className={classNames([styles.navItem, { [styles.active]: activeIndex === index }])}
            onClick={() => onNavItemClick(index, item.path)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Sidebar
