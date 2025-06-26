'use client'

import { DeleteOutlined, FolderOutlined, ShareAltOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { setFileList } from '@/lib/store/features/fileSlice'
import { useAppDispatch } from '@/lib/store/hooks'

import styles from './styles.module.scss'

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  const navList = [
    {
      path: '/list-page/files',
      label: '全部文件',
      icon: <FolderOutlined />
    },
    {
      path: '/list-page/images',
      label: '图片',
      icon: null
    },
    {
      path: '/list-page/docs',
      label: '文档',
      icon: null
    },
    {
      path: '/list-page/videos',
      label: '视频',
      icon: null
    },
    {
      path: '/list-page/musics',
      label: '音乐',
      icon: null
    },
    {
      path: '/list-page/shares',
      label: '我的分享',
      icon: <ShareAltOutlined />
    },
    {
      path: '/list-page/recycles',
      label: '回收站',
      icon: <DeleteOutlined />
    }
  ]

  useEffect(() => {
    const index = navList.findIndex(item => item.path === pathname)
    setActiveIndex(index)
  }, [])

  const onNavItemClick = (index: number, path: string) => {
    setActiveIndex(index)
    dispatch(setFileList([]))
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
