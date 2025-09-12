'use client'

import { useEffect, useRef } from 'react'

import Breadcrumb from '@/components/breadcrumb'
import FileButtonGroup from '@/components/file-button-group'
import FileTable from '@/components/file-table'
import Search from '@/components/search'

import { FileTypeEnum } from '@/lib/constants/base'
import { useFileStore } from '@/lib/store/fileStore'
import { useUserStore } from '@/lib/store/userStore'

import styles from './styles.module.scss'

function Files() {
  const { userInfo } = useUserStore()
  const { setFileTypes, setBreadcrumbList, getFileAction } = useFileStore()

  const firstLoadRef = useRef(true)

  useEffect(() => {
    if (!userInfo?.rootFileId || !firstLoadRef.current) {
      return
    }

    firstLoadRef.current = false

    getFileAction({ parentId: userInfo.rootFileId, fileTypes: FileTypeEnum.ALL_FILE })
    const initBreadcrumbList = [
      {
        id: userInfo.rootFileId,
        name: userInfo.rootFilename,
        parentId: userInfo.rootFileId
      }
    ]
    setBreadcrumbList(initBreadcrumbList)
  }, [userInfo])

  useEffect(() => {
    setFileTypes(FileTypeEnum.ALL_FILE)
  }, [])

  return (
    <main className={styles.root}>
      {/* 头部区域 */}
      <section className={styles.topButtonGroup}>
        <FileButtonGroup />
        <Search />
      </section>

      {/* 面包屑 */}
      <section className={styles.breadcrumb}>
        <Breadcrumb />
      </section>

      {/* 文件列表 */}
      <section className={styles.fileList}>
        <FileTable />
      </section>
    </main>
  )
}

export default Files
