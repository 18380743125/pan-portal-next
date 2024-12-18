'use client'

import { Button, Table, TableColumnsType, Tooltip } from 'antd'
import { LinkOutlined, PoweroffOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'
import React, { useEffect, useRef, useState } from 'react'
import useTableScrollHeight from '@/hooks/useTableScrollHeight'
import { getShareListApi } from '@/api/features/share'

export default function ShareFC() {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableScrollY] = useTableScrollHeight(tableRef)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>()
  const [shareList, setShareList] = useState<Record<string, any>[]>()

  const loadData = async () => {
    const shareData = await getShareListApi()
    setShareList(shareData)
  }

  useEffect(() => {
    loadData()
  }, [])

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys as string[])
  }

  // 复制链接
  const onCopyLink = row => {
    console.log(row)
  }

  // 取消分享
  const onCancelShare = row => {
    console.log(row)
  }

  const columns: TableColumnsType = [
    {
      title: '分享名称',
      dataIndex: 'shareName'
    },
    {
      dataIndex: 'operator',
      render: (_, row) => (
        <section>
          <div className={styles.btnGroup}>
            {/* 复制链接 */}
            <Tooltip
              placement='top'
              overlayInnerStyle={{ color: '#666', fontSize: 12 }}
              color='#fff'
              title={'复制链接'}
            >
              <Button
                className={styles.copyBtn}
                size={'small'}
                type={'primary'}
                shape={'circle'}
                icon={<LinkOutlined />}
                onClick={() => onCopyLink(row)}
              />
            </Tooltip>

            {/* 取消分享 */}
            <Tooltip
              placement='top'
              overlayInnerStyle={{ color: '#666', fontSize: 12 }}
              color='#fff'
              title={'取消分享'}
            >
              <Button
                className={styles.cancelBtn}
                size={'small'}
                type={'primary'}
                shape={'circle'}
                icon={<PoweroffOutlined />}
                onClick={() => onCancelShare(row)}
              />
            </Tooltip>
          </div>
        </section>
      )
    },
    {
      title: '分享链接',
      dataIndex: 'shareUrl'
    },
    {
      title: '提取码',
      dataIndex: 'shareCode'
    },
    {
      title: '分享时间',
      dataIndex: 'createTime'
    },
    {
      title: '分享状态',
      dataIndex: 'shareEndTime',
      render: (value: string) => <div>{value} 到期</div>
    }
  ]

  return (
    <main className={styles.root}>
      {/* 操作按钮 */}
      <section className={styles.topButton}>
        <Button
          className={styles.cancelBtn}
          type={'primary'}
          shape={'round'}
          icon={<PoweroffOutlined />}
          onClick={onCancelShare}
        >
          取消分享
        </Button>
      </section>

      {/* 分享列表 */}
      <section className={styles.shareList} ref={tableRef}>
        <Table
          scroll={{ y: tableScrollY, x: 'max-content', scrollToFirstRowOnChange: true }}
          rowKey='shareId'
          pagination={false}
          columns={columns}
          dataSource={shareList}
          rowClassName={styles.rowClass}
          rowSelection={{ type: 'checkbox', selectedRowKeys, onChange: onSelectChange }}
        />
      </section>
    </main>
  )
}
