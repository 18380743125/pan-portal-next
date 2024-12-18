'use client'

import { useEffect } from 'react'

import styles from '@/app/list-page/images/styles.module.scss'
import FileButtonGroupFC from '@/components/file-button-group'
import SearchFC from '@/components/search'
import FileTable from '@/components/file-table'
import { useAppDispatch } from '@/lib/store/hooks'
import { FileTypeEnum, PanEnum } from '@/lib/constants'
import { getFileAction } from '@/lib/store/features/fileSlice'

export default function Home() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const fileTypes = [FileTypeEnum.VIDEO_FILE].join(PanEnum.COMMON_SEPARATOR)
    dispatch(getFileAction({ parentId: FileTypeEnum.ALL_FILE, fileTypes }))
  }, [])
  return (
    <main className={styles.root}>
      {/* 头部区域 */}
      <section className={styles.topButtonGroup}>
        <FileButtonGroupFC />
        <SearchFC />
      </section>

      {/*  文件列表 */}
      <section className={styles.fileList}>
        <FileTable />
      </section>
    </main>
  )
}
