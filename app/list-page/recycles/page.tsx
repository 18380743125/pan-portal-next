'use client'

import { Button, Table, TableColumnsType, Tooltip } from 'antd'
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons'

import React, { useEffect, useRef, useState } from 'react'
import useTableScrollHeight from '@/hooks/useTableScrollHeight'
import { deleteRecycleApi, getRecycleListApi, restoreRecycleApi } from '@/api/features/recycle'
import { getFileFontElement } from '@/lib/utils/file-util'
import { FileItem } from '@/types/file'
import { message, modal } from '@/lib/AntdGlobal'
import { PanEnum } from '@/lib/constants/base'

import styles from './styles.module.scss'

export default function RecyclesFC() {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableScrollY] = useTableScrollHeight(tableRef)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
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

  // 还原
  const onRestore = async (row?: FileItem) => {
    if (!row && selectedRowKeys?.length === 0) {
      return message.warning('请选择要还原的文件')
    }
    let fileIds = row?.fileId
    let newKeys = [] as string[]
    if (row) {
      // 单个取消
      newKeys = selectedRowKeys.filter(item => item !== row.fileId)
    } else {
      // 批量取消
      fileIds = selectedRowKeys.join(PanEnum.COMMON_SEPARATOR)
    }

    setSelectedRowKeys(newKeys)
    await restoreRecycleApi(fileIds)
    message.success('还原成功')
    loadData()
  }

  // 彻底删除
  const onDelete = row => {
    modal.confirm({
      title: '提示',
      cancelText: '取消',
      okText: '确定',
      closable: true,
      content: <div style={{ marginBottom: 10 }}>{`文件删除后将不可恢复，您确定这样做吗？`}</div>,
      async onOk() {
        await deleteRecycleApi(row.fileId)
        const newKey = selectedRowKeys.filter(item => item !== row.fileId)
        setSelectedRowKeys(newKey)
        message.success('删除成功')
        loadData()
      }
    })
  }

  // 清空回收站
  const onClear = async () => {
    if (cycleList?.length === 0) {
      return
    }
    const fileIds = cycleList?.map(item => item.fileId) as string[]
    modal.confirm({
      title: '提示',
      cancelText: '取消',
      okText: '确定',
      closable: true,
      content: <div style={{ marginBottom: 10 }}>{`文件删除后将不可恢复，您确定这样做吗？`}</div>,
      async onOk() {
        await deleteRecycleApi(fileIds.join(PanEnum.COMMON_SEPARATOR))
        setSelectedRowKeys([])
        loadData()
      }
    })
  }

  const columns: TableColumnsType = [
    {
      title: '文件名',
      dataIndex: 'filename',
      minWidth: 360,
      render: (text: string, row) => (
        <div className={styles.filename}>
          <span>{getFileFontElement(row as FileItem)}</span>
          <span className={styles.text}>{text}</span>
        </div>
      )
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
                onClick={() => onRestore(row as FileItem)}
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
      dataIndex: 'updateTime',
      width: 220
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
          onClick={() => onRestore()}
        >
          还原
        </Button>

        <Button
          className={styles.deleteBtn}
          type={'primary'}
          shape={'round'}
          icon={<DeleteOutlined />}
          onClick={onClear}
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
