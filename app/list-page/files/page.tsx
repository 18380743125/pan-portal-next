'use client'

import { useEffect } from 'react'
import BreadcrumbFC from '@/components/breadcrumb'
import FileTable from '@/components/file-table'

import FileButtonGroupFC from '@/components/file-button-group'
import SearchFC from '@/components/search'

import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { getFileAction, setBreadcrumbList, setFileTypes } from '@/lib/store/features/fileSlice'
import styles from './styles.module.scss'
import { FileTypeEnum } from '@/lib/constants'

export default function FilesFC() {
  const dispatch = useAppDispatch()

  const { userInfo, fileTypes } = useAppSelector(
    state => ({
      fileTypes: state.file.fileType,
      userInfo: state.user.userInfo
    }),
    shallowEqualApp
  )

  useEffect(() => {
    if (fileTypes !== '-1') {
      return
    }
    if (userInfo?.rootFileId) {
      dispatch(getFileAction({ parentId: userInfo.rootFileId, fileTypes }))
      const initBreadcrumbList = [
        {
          id: userInfo.rootFileId,
          name: userInfo.rootFilename,
          parentId: userInfo.rootFileId
        }
      ]
      dispatch(setBreadcrumbList({ list: initBreadcrumbList }))
    }
  }, [userInfo, fileTypes])

  useEffect(() => {
    dispatch(setFileTypes(FileTypeEnum.ALL_FILE))
  }, [])

  return (
    <main className={styles.root}>
      {/* 头部区域 */}
      <section className={styles.topButtonGroup}>
        <FileButtonGroupFC />
        <SearchFC />
      </section>

      {/* 面包屑 */}
      <section className={styles.breadcrumb}>
        <BreadcrumbFC />
      </section>

      {/* 文件列表 */}
      <section className={styles.fileList}>
        <FileTable />
      </section>
    </main>
  )
}
