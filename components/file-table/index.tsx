'use client'

import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  SendOutlined,
  ShareAltOutlined
} from '@ant-design/icons'
import { Button, Table, TableColumnsType, Tooltip } from 'antd'
import React, { useMemo, useRef, useState } from 'react'

import Copy from '@/components/button-list/copy-button/copy'
import Rename from '@/components/button-list/rename-button/rename'
import Share from '@/components/button-list/share-button/share'
import Transfer from '@/components/button-list/transfer-button/transfer'
import ImageViewer, { type ImageType } from '../image-viewer'

import useFileHandler from '@/hooks/useFileHandler'
import useTableScrollHeight from '@/hooks/useTableScrollHeight'
import { FileTypeEnum, PanEnum, previewPathMap } from '@/lib/constants/base'
import { useFileStore } from '@/lib/store/fileStore'
import { getFileFontElement, getPreviewUrl } from '@/lib/utils/file-util'
import type { FileItem } from '@/types/file'

import styles from './styles.module.scss'

const FileTable = () => {
  const { fileList, selectFileList, setSelectFileList, getFileAction, getBreadcrumbListAction } = useFileStore()

  const [viewerVisible, setViewerVisible] = useState(false)
  const [imgList, setImgList] = useState<ImageType[]>([])
  const [imgIndex, setImgIndex] = useState(-1)

  const renameRef = useRef<{ open: (row?: FileItem) => void }>(null)
  const shareRef = useRef<{ open: (rows?: FileItem[]) => void }>(null)
  const copyRef = useRef<{ open: (rows?: FileItem[]) => void }>(null)
  const moveRef = useRef<{ open: (rows?: FileItem[]) => void }>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableScrollY] = useTableScrollHeight(tableRef)

  const selectedRowKeys = useMemo(() => {
    return selectFileList.map(file => file.fileId)
  }, [selectFileList])

  const { onDownload, onDelete } = useFileHandler()

  const onSelectChange = (_: React.Key[], rows: FileItem[]) => {
    setSelectFileList(rows)
  }

  const onFileNameClick = (row: FileItem) => {
    // 下一级目录
    if (row.folderFlag === PanEnum.FOLDER_FLAG) {
      getBreadcrumbListAction(row.fileId)
      getFileAction({ parentId: row.fileId, fileType: FileTypeEnum.ALL_FILE })
      setSelectFileList([])
    } else {
      // 文件预览
      if (row.fileType == FileTypeEnum.IMAGE_FILE) {
        showImages(row)
      } else if (row.fileType == FileTypeEnum.PDF_FILE) {
        const type = previewPathMap[FileTypeEnum.PDF_FILE]
        const url = `/preview/${type}/${encodeURIComponent(row.fileId)}?filename=${encodeURIComponent(row.filename)}`
        window.open(url, '_blank')
      }
    }
  }

  // 预览图片
  const showImages = (row: FileItem) => {
    const list = [] as ImageType[]
    for (let i = 0; i < fileList.length; i++) {
      const item = fileList[i]
      if (item.fileType === Number(FileTypeEnum.IMAGE_FILE)) {
        list.push({
          src: getPreviewUrl(item.fileId),
          alt: item.filename
        })
      }
    }
    setImgList(list)
    for (const [key, item] of Object.entries(list)) {
      if (item.src.includes(encodeURIComponent(row.fileId))) setImgIndex(Number(key))
    }
    setViewerVisible(true)
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
      render: (text: string, row) => (
        <Tooltip title={text}>
          <div className={styles.filename} onClick={() => onFileNameClick(row)}>
            <span>{getFileFontElement(row)}</span>
            <span className={styles.text}>{text}</span>
          </div>
        </Tooltip>
      )
    },
    {
      dataIndex: 'operator',
      render: (_, row) => (
        <section>
          <div className={styles.btnGroup}>
            {/* 下载 */}
            <Tooltip placement='top' styles={{ body: { color: '#666', fontSize: 12 } }} color='#fff' title={'下载'}>
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
            <Tooltip placement='top' styles={{ body: { color: '#666', fontSize: 12 } }} color='#fff' title={'重命名'}>
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
            <Tooltip placement='top' styles={{ body: { color: '#666', fontSize: 12 } }} color='#fff' title={'删除'}>
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
            <Tooltip placement='top' styles={{ body: { color: '#666', fontSize: 12 } }} color='#fff' title={'分享'}>
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
            <Tooltip placement='top' styles={{ body: { color: '#666', fontSize: 12 } }} color='#fff' title={'复制到'}>
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
            <Tooltip placement='top' styles={{ body: { color: '#666', fontSize: 12 } }} color='#fff' title={'移动到'}>
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
      width: 200,
      align: 'left'
    },
    {
      title: '修改日期',
      dataIndex: 'updateTime',
      width: 280,
      align: 'left'
    }
  ]

  return (
    <section className={styles.root}>
      {/* 重命名文件 */}
      <Rename ref={renameRef} />

      {/* 分享文件 */}
      <Share ref={shareRef} />

      {/* 复制文件 */}
      <Copy ref={copyRef} />

      {/* 移动文件 */}
      <Transfer ref={moveRef} />

      <section ref={tableRef}>
        <Table<FileItem>
          scroll={{ y: tableScrollY, scrollToFirstRowOnChange: true }}
          rowKey='fileId'
          pagination={false}
          columns={columns}
          dataSource={fileList as FileItem[]}
          rowClassName={styles.rowClass}
          rowSelection={{ type: 'checkbox', selectedRowKeys, onChange: onSelectChange }}
        />
      </section>

      {viewerVisible && (
        <ImageViewer images={imgList} current={imgIndex} onClose={() => setViewerVisible(false)} showDownload={true} />
      )}
    </section>
  )
}

export default FileTable
