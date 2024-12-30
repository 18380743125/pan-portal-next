'use client'

import { useEffect } from 'react'
import FileTable from '@/components/file-table'
import FileButtonGroupFC from '@/components/file-button-group'
import SearchFC from '@/components/search'

import { useAppDispatch } from '@/lib/store/hooks'
import { FileTypeEnum, PanEnum } from '@/lib/constants'
import { getFileAction, setFileTypes } from '@/lib/store/features/fileSlice'
import styles from './styles.module.scss'

export default function ImagesFC() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const fileTypes = [FileTypeEnum.IMAGE_FILE].join(PanEnum.COMMON_SEPARATOR)
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
