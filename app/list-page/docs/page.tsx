'use client'

import { useEffect } from 'react'

import FileButtonGroup from '@/components/file-button-group'
import FileTable from '@/components/file-table'
import SearchFC from '@/components/search'
import { FileTypeEnum, PanEnum } from '@/lib/constants/base'
import { getFileAction, setFileTypes } from '@/lib/store/features/fileSlice'
import { useAppDispatch } from '@/lib/store/hooks'

import styles from './styles.module.scss'

export default function DocsFC() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    // 文档
    const fileTypes = [
      FileTypeEnum.WORD_FILE,
      FileTypeEnum.EXCEL_FILE,
      FileTypeEnum.POWER_POINT_FILE,
      FileTypeEnum.PDF_FILE,
      FileTypeEnum.TXT_FILE,
      FileTypeEnum.SOURCE_CODE_FILE
    ].join(PanEnum.COMMON_SEPARATOR)
    dispatch(setFileTypes(fileTypes))
    dispatch(getFileAction({ parentId: '-1', fileTypes }))
  }, [])

  return (
    <main className={styles.root}>
      {/* 头部区域 */}
      <section className={styles.topButtonGroup}>
        <FileButtonGroup />
        <SearchFC />
      </section>

      {/*  文件列表 */}
      <section className={styles.fileList}>
        <FileTable />
      </section>
    </main>
  )
}
