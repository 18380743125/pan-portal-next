'use client'

import React, { useState } from 'react'
import { Button, Table, TableColumnsType, Tooltip } from 'antd'
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  SendOutlined,
  ShareAltOutlined
} from '@ant-design/icons'

import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { getFileFontElement } from '@/lib/utils/file.util'

import type { FileItem } from '@/types/file'
import styles from './styles.module.scss'
import { getBreadcrumbListAction, getFileAction } from '@/lib/store/features/fileSlice'
import { FileTypeEnum } from '@/lib/constants'
import useFileHandler from '@/hooks/useFileHandler'

const Breadcrumb = () => {
  const dispatch = useAppDispatch()

  const { fileList } = useAppSelector(
    state => ({
      fileList: state.file.fileList
    }),
    shallowEqualApp
  )

  const [selectRows, setSelectRows] = useState<FileItem[]>([])

  const { onDownload, onRename, onDelete, onShare, onCopy, onMove } = useFileHandler()

  const onSelectChange = (selectedRowKeys: React.Key[], rows: FileItem[]) => {
    setSelectRows(rows)
    console.log(selectRows)
  }

  const onFileNameClick = (row: FileItem) => {
    // 下一级目录
    if (row.folderFlag === 1) {
      dispatch(getBreadcrumbListAction(row.fileId))
      dispatch(getFileAction({ parentId: row.fileId, fileType: FileTypeEnum.ALL_FILE }))
    } else {
      // 文件预览
    }
  }

  const columns: TableColumnsType<FileItem> = [
    {
      title: '文件名',
      dataIndex: 'filename',
      width: 360,
      sorter: (a, b) => a.filename.localeCompare(b.filename),
      render: (text: string, row) => (
        <div className={styles.filename} onClick={() => onFileNameClick(row)}>
          <span>{getFileFontElement(row)}</span>
          <span className={styles.text}>{text}</span>
        </div>
      )
    },
    {
      dataIndex: 'operator',
      render: (_, row) => (
        <section>
          <div className={styles.btnGroup}>
            {/* 下载 */}
            <Tooltip placement='top' overlayInnerStyle={{ color: '#666', fontSize: 12 }} color='#fff' title={'下载'}>
              <Button
                className={styles.downloadBtn}
                size={'small'}
                type={'primary'}
                shape={'circle'}
                icon={<DownloadOutlined />}
                onClick={() => onDownload(row)}
              />
            </Tooltip>

            {/* 重命名 */}
            <Tooltip placement='top' overlayInnerStyle={{ color: '#666', fontSize: 12 }} color='#fff' title={'重命名'}>
              <Button
                className={styles.renameBtn}
                size={'small'}
                type={'primary'}
                shape={'circle'}
                icon={<EditOutlined />}
                onClick={() => onRename(row)}
              />
            </Tooltip>

            {/* 删除 */}
            <Tooltip placement='top' overlayInnerStyle={{ color: '#666', fontSize: 12 }} color='#fff' title={'删除'}>
              <Button
                className={styles.deleteBtn}
                size={'small'}
                type={'primary'}
                shape={'circle'}
                icon={<DeleteOutlined />}
                onClick={() => onDelete(row)}
              />
            </Tooltip>

            {/* 分享 */}
            <Tooltip placement='top' overlayInnerStyle={{ color: '#666', fontSize: 12 }} color='#fff' title={'分享'}>
              <Button
                className={styles.shareBtn}
                size={'small'}
                type={'primary'}
                shape={'circle'}
                icon={<ShareAltOutlined />}
                onClick={() => onShare(row)}
              />
            </Tooltip>

            {/* 复制 */}
            <Tooltip placement='top' overlayInnerStyle={{ color: '#666', fontSize: 12 }} color='#fff' title={'复制到'}>
              <Button
                className={styles.copyBtn}
                size={'small'}
                type={'default'}
                shape={'circle'}
                icon={<CopyOutlined />}
                onClick={() => onCopy(row)}
              />
            </Tooltip>

            {/* 移动 */}
            <Tooltip placement='top' overlayInnerStyle={{ color: '#666', fontSize: 12 }} color='#fff' title={'移动到'}>
              <Button
                size={'small'}
                type={'default'}
                shape={'circle'}
                icon={<SendOutlined />}
                onClick={() => onMove(row)}
              />
            </Tooltip>
          </div>
        </section>
      )
    },
    {
      title: '大小',
      dataIndex: 'fileSizeDesc',
      width: 200
    },
    {
      title: '修改日期',
      dataIndex: 'updateTime',
      width: 280
    }
  ]

  return (
    <section className={styles.root}>
      <Table<FileItem>
        rowKey='fileId'
        pagination={false}
        columns={columns}
        dataSource={fileList as FileItem[]}
        rowClassName={styles.rowClass}
        rowSelection={{ type: 'checkbox', onChange: onSelectChange }}
      />
    </section>
  )
}

export default Breadcrumb
