'use client'

import { Button, Divider } from 'antd'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'

import styles from './styles.module.scss'
import React from 'react'
import { getFileAction, setBreadcrumbList } from '@/lib/store/features/fileSlice'
import { FileTypeEnum } from '@/lib/constants'

const BreadcrumbFC = () => {
  const dispatch = useAppDispatch()

  const { breadcrumbList } = useAppSelector(
    state => ({
      breadcrumbList: state.file.breadcrumbList
    }),
    shallowEqualApp
  )

  // 返回上一级
  const onBackClick = () => {
    const size = breadcrumbList.length
    if (size > 1) {
      const item = breadcrumbList[size - 2]
      dispatch(getFileAction({ parentId: item.id, fileType: FileTypeEnum.ALL_FILE }))

      // 更新面包屑
      const newBreadcrumbList = [...breadcrumbList.slice(0, size - 1)]
      dispatch(setBreadcrumbList({ list: newBreadcrumbList }))
    }
  }

  // 返回指定目录
  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: Record<string, any>) => {
    e.preventDefault()
    // 初始化时，全部文件中 id 为空
    if (!item.id) {
      return
    }

    const newBreadcrumbList = [] as Record<string, any>[]
    for (const breadcrumb of breadcrumbList) {
      newBreadcrumbList.push(breadcrumb)
      if (breadcrumb.id === item.id) {
        break
      }
    }
    const last = newBreadcrumbList[newBreadcrumbList.length - 1]
    dispatch(getFileAction({ parentId: last.id, fileType: FileTypeEnum.ALL_FILE }))
    dispatch(setBreadcrumbList({ list: newBreadcrumbList }))
  }

  return (
    <section className={styles.root}>
      <Button className={styles.backBtn} type='link' onClick={onBackClick}>
        返回
      </Button>

      {/* 分割线 */}
      <Divider type='vertical' className={styles.divider} />

      <ul className={styles.list}>
        {breadcrumbList.map((item, index) => (
          <li className={styles.item} key={index}>
            <a className={styles.text} href='' onClick={e => onNavClick(e, item)}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default BreadcrumbFC
