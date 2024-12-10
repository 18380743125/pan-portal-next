'use client'

import React from 'react'
import { Button, Table, TableColumnsType } from 'antd'
import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'

import type { FileItem } from '@/types/file'
import styles from './styles.module.scss'

const Breadcrumb = () => {
  const { fileList } = useAppSelector(
    state => ({
      fileList: state.file.fileList
    }),
    shallowEqualApp
  )

  const columns: TableColumnsType<FileItem> = [
    {
      title: '文件名',
      dataIndex: 'filename',
      // sorter: ({ filename: a }, { filename: b }) => a.toLowerCase().localeCompare(b.toLowerCase()),
      width: 360,
      render: text => <span style={{ cursor: 'pointer' }}>{text}</span>
    },
    {},
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

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: FileItem[]) => {
    console.log(selectedRowKeys, selectedRows)
  }

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
