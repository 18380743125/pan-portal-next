'use client'

import { useEffect } from 'react'

import styles from '@/app/list-page/images/styles.module.scss'
import FileButtonGroupFC from '@/components/file-button-group'
import SearchFC from '@/components/search'
import FileTable from '@/components/file-table'
import { useAppDispatch } from '@/lib/store/hooks'
import { FileTypeEnum, PanEnum } from '@/lib/constants'
import { getFileAction, setFileTypes } from '@/lib/store/features/fileSlice'

export default function MusicFC() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const fileTypes = [FileTypeEnum.AUDIO_FILE].join(PanEnum.COMMON_SEPARATOR)
    dispatch(setFileTypes(fileTypes))
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
