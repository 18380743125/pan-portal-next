'use client'

import { useEffect } from 'react'

import FileButtonGroup from '@/components/file-button-group'
import FileTable from '@/components/file-table'
import Search from '@/components/search'

import { FileTypeEnum, PanEnum } from '@/lib/constants/base'
import { useFileStore } from '@/lib/store/fileStore'

import styles from './styles.module.scss'

export default function ImagesFC() {
  const { setFileTypes, getFileAction } = useFileStore()

  useEffect(() => {
    // 图片
    const fileTypes = [FileTypeEnum.IMAGE_FILE].join(PanEnum.COMMON_SEPARATOR)
    setFileTypes(fileTypes)
    getFileAction({ parentId: '-1', fileTypes })
  }, [])

  return (
    <main className={styles.root}>
      {/* 头部区域 */}
      <section className={styles.topButtonGroup}>
        <FileButtonGroup />
        <Search />
      </section>

      {/*  文件列表 */}
      <section className={styles.fileList}>
        <FileTable />
      </section>
    </main>
  )
}
