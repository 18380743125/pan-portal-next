'use client'

import { useEffect } from 'react'

import Breadcrumb from '@/components/breadcrumb'
import FileButtonGroup from '@/components/file-button-group'
import FileTable from '@/components/file-table'
import Search from '@/components/search'

import { FileTypeEnum } from '@/lib/constants/base'
import { getFileAction, setBreadcrumbList, setFileTypes } from '@/lib/store/features/fileSlice'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'

import styles from './styles.module.scss'

function Files() {
  const dispatch = useAppDispatch()

  const { userInfo, fileTypes } = useAppSelector(
    state => ({
      fileTypes: state.file.fileType,
      userInfo: state.user.userInfo
    }),
    shallowEqualApp
  )

  useEffect(() => {
    if (fileTypes !== FileTypeEnum.ALL_FILE || !userInfo) {
      return
    }

    dispatch(getFileAction({ parentId: userInfo.rootFileId, fileTypes }))
    const initBreadcrumbList = [
      {
        id: userInfo.rootFileId,
        name: userInfo.rootFilename,
        parentId: userInfo.rootFileId
      }
    ]
    dispatch(setBreadcrumbList({ list: initBreadcrumbList }))
  }, [userInfo, fileTypes])

  useEffect(() => {
    // 所有文件
    dispatch(setFileTypes(FileTypeEnum.ALL_FILE))
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
