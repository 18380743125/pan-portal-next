'use client'

import { useEffect } from 'react'

import FileButtonGroup from '@/components/file-button-group'
import FileTable from '@/components/file-table'
import Search from '@/components/search'
import { FileTypeEnum, PanEnum } from '@/lib/constants/base'
import { getFileAction, setFileTypes } from '@/lib/store/features/fileSlice'
import { useAppDispatch } from '@/lib/store/hooks'

import styles from './styles.module.scss'

function Videos() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    // 视频
    const fileTypes = [FileTypeEnum.VIDEO_FILE].join(PanEnum.COMMON_SEPARATOR)
    dispatch(setFileTypes(fileTypes))
    dispatch(getFileAction({ parentId: '-1', fileTypes }))
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

export default Videos
