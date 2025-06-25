'use client'

import { useEffect } from 'react'

import styles from '@/app/list-page/images/styles.module.scss'
import FileButtonGroupFC from '@/components/file-button-group'
import SearchFC from '@/components/search'
import FileTable from '@/components/file-table'
import { getFileAction, setFileTypes } from '@/lib/store/features/fileSlice'
import { FileTypeEnum, PanEnum } from '@/lib/constants/base'
import { useAppDispatch } from '@/lib/store/hooks'

export default function DocsFC() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const fileTypes = [
      FileTypeEnum.WORD_FILE,
      FileTypeEnum.EXCEL_FILE,
      FileTypeEnum.POWER_POINT_FILE,
      FileTypeEnum.PDF_FILE,
      FileTypeEnum.TXT_FILE,
      FileTypeEnum.SOURCE_CODE_FILE
    ].join(PanEnum.COMMON_SEPARATOR)
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
