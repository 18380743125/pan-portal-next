'use client'

import { Button, Table, TableColumnsType, Tooltip } from 'antd'
import { DeleteOutlined, PoweroffOutlined, UndoOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'
import React, { useEffect, useRef, useState } from 'react'
import useTableScrollHeight from '@/hooks/useTableScrollHeight'
import { getRecycleListApi } from '@/api/features/recycle'

export default function RecyclesFC() {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableScrollY] = useTableScrollHeight(tableRef)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>()
  const [cycleList, setCycleList] = useState<Record<string, any>[]>()

  const loadData = async () => {
    const list = await getRecycleListApi()
    setCycleList(list)
  }

  useEffect(() => {
    loadData()
  }, [])

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys as string[])
  }

  // 复制链接
  const onRestore = row => {
    console.log(row)
  }

  // 取消分享
  const onDelete = row => {
    console.log(row)
  }

  const columns: TableColumnsType = [
    {
      title: '文件名',
      dataIndex: 'filename'
    },
    {
      dataIndex: 'operator',
      render: (_, row) => (
        <section>
          <div className={styles.btnGroup}>
            {/* 还原 */}
            <Tooltip placement='top' overlayInnerStyle={{ color: '#666', fontSize: 12 }} color='#fff' title={'还原'}>
              <Button
                className={styles.restoreBtn}
                size={'small'}
                type={'primary'}
                shape={'circle'}
                icon={<UndoOutlined />}
                onClick={() => onRestore(row)}
              />
            </Tooltip>

            {/* 彻底删除 */}
            <Tooltip
              placement='top'
              overlayInnerStyle={{ color: '#666', fontSize: 12 }}
              color='#fff'
              title={'彻底删除'}
            >
              <Button
                className={styles.deleteBtn}
                size={'small'}
                type={'primary'}
                shape={'circle'}
                icon={<DeleteOutlined />}
                onClick={() => onDelete(row)}
              />
            </Tooltip>
          </div>
        </section>
      )
    },
    {
      title: '大小',
      dataIndex: 'fileSizeDesc'
    },
    {
      title: '删除日期',
      dataIndex: 'updateTime'
    }
  ]

  return (
    <main className={styles.root}>
      {/* 操作按钮 */}
      <section className={styles.topButton}>
        <Button
          className={styles.restoreBtn}
          type={'primary'}
          shape={'round'}
          icon={<UndoOutlined />}
          onClick={onRestore}
        >
          还原
        </Button>

        <Button
          className={styles.deleteBtn}
          type={'primary'}
          shape={'round'}
          icon={<DeleteOutlined />}
          onClick={onRestore}
        >
          清空回收站
        </Button>
      </section>

      {/* 分享列表 */}
      <section className={styles.shareList} ref={tableRef}>
        <Table
          scroll={{ y: tableScrollY, x: 'max-content', scrollToFirstRowOnChange: true }}
          rowKey='fileId'
          pagination={false}
          columns={columns}
          dataSource={cycleList}
          rowClassName={styles.rowClass}
          rowSelection={{ type: 'checkbox', selectedRowKeys, onChange: onSelectChange }}
        />
      </section>
    </main>
  )
}
