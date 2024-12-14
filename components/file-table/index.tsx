'use client'

import React, { useRef } from 'react'
import { Button, Table, TableColumnsType, Tooltip } from 'antd'
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  SendOutlined,
  ShareAltOutlined
} from '@ant-design/icons'

import RenameFC from '@/components/button-list/rename-button/rename'
import ShareFC from '@/components/button-list/share-button/share'

import { getBreadcrumbListAction, getFileAction, setSelectFileList } from '@/lib/store/features/fileSlice'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { getFileFontElement } from '@/lib/utils/file.util'
import { FileTypeEnum, PanEnum } from '@/lib/constants'
import useFileHandler from '@/hooks/useFileHandler'
import type { FileItem } from '@/types/file'

import styles from './styles.module.scss'
import CopyFC from '@/components/button-list/copy-button/copy'
import TransferFC from '@/components/button-list/transfer-button/transfer'
import useTableScrollHeight from '@/hooks/useTableScrollHeight'

const Breadcrumb = () => {
  const dispatch = useAppDispatch()

  const { fileList } = useAppSelector(
    state => ({
      fileList: state.file.fileList
    }),
    shallowEqualApp
  )

  const renameRef = useRef<{ open: (row?: FileItem) => void }>(null)
  const shareRef = useRef<{ open: (rows?: FileItem[]) => void }>(null)
  const copyRef = useRef<{ open: (rows?: FileItem[]) => void }>(null)
  const moveRef = useRef<{ open: (rows?: FileItem[]) => void }>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableScrollY] = useTableScrollHeight(tableRef)
  console.log(tableScrollY)

  const { onDownload, onDelete } = useFileHandler()

  const onSelectChange = (selectedRowKeys: React.Key[], rows: FileItem[]) => {
    dispatch(setSelectFileList(rows))
  }

  const onFileNameClick = (row: FileItem) => {
    // 下一级目录
    if (row.folderFlag === PanEnum.FOLDER_FLAG) {
      dispatch(getBreadcrumbListAction(row.fileId))
      dispatch(getFileAction({ parentId: row.fileId, fileType: FileTypeEnum.ALL_FILE }))
    } else {
      // 文件预览
    }
  }

  // 重命名文件
  const onRename = (item: FileItem) => {
    renameRef.current?.open(item)
  }

  // 分享文件
  const onShare = (row: FileItem) => {
    shareRef.current?.open([row])
  }

  // 复制文件
  const onCopy = (row: FileItem) => {
    copyRef.current?.open([row])
  }

  // 移动文件
  const onMove = (row: FileItem) => {
    moveRef.current?.open([row])
  }

  const columns: TableColumnsType<FileItem> = [
    {
      title: '文件名',
      dataIndex: 'filename',
      width: 360,
      // sorter: (a, b) => a.filename.localeCompare(b.filename),
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
      {/* 重命名文件 */}
      <RenameFC ref={renameRef} />

      {/* 分享文件 */}
      <ShareFC ref={shareRef} />

      {/* 复制文件 */}
      <CopyFC ref={copyRef} />

      {/* 移动文件 */}
      <TransferFC ref={moveRef} />

      <section ref={tableRef}>
        <Table<FileItem>
          scroll={{ y: tableScrollY, scrollToFirstRowOnChange: true }}
          rowKey='fileId'
          pagination={false}
          columns={columns}
          dataSource={fileList as FileItem[]}
          rowClassName={styles.rowClass}
          rowSelection={{ type: 'checkbox', onChange: onSelectChange }}
        />
      </section>
    </section>
  )
}

export default Breadcrumb
