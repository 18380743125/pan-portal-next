'use client'

import { useEffect } from 'react'

import styles from '@/app/list-page/images/styles.module.scss'
import FileButtonGroup from '@/components/file-button-group'
import FileTable from '@/components/file-table'
import Search from '@/components/search'
import { FileTypeEnum, PanEnum } from '@/lib/constants/base'
import { getFileAction, setFileTypes } from '@/lib/store/features/fileSlice'
import { useAppDispatch } from '@/lib/store/hooks'

export default function MusicFC() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // 音乐
    const fileTypes = [FileTypeEnum.AUDIO_FILE].join(PanEnum.COMMON_SEPARATOR)
    dispatch(setFileTypes(fileTypes))
    dispatch(getFileAction({ parentId: FileTypeEnum.ALL_FILE, fileTypes }))
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
