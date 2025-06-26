'use client'

import { LinkOutlined, PoweroffOutlined } from '@ant-design/icons'
import { Button, Table, TableColumnsType, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

import { cancelShareApi, getShareListApi } from '@/api/features/share'
import useTableScrollHeight from '@/hooks/useTableScrollHeight'
import { message, modal } from '@/lib/AntdGlobal'
import { PanEnum } from '@/lib/constants/base'
import { copyText2Clipboard } from '@/lib/utils/base'

import styles from './styles.module.scss'

function Share() {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableScrollY] = useTableScrollHeight(tableRef)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
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
  const onCopyLink = (e, row) => {
    e.preventDefault()
    const text = `链接：${row?.shareUrl}  提取码：${row?.shareCode}  赶快分享给小伙伴吧！`
    copyText2Clipboard(text)
    message.info('已复制').then(() => {})
  }

  // 取消分享
  const onCancelShare = (row?: Record<string, any>) => {
    if (!row && selectedRowKeys?.length === 0) {
      return message.warning('请选择要取消的分享')
    }
    let shareIds = row?.shareId
    let newKeys = [] as string[]

    if (row) {
      newKeys = selectedRowKeys.filter(item => item !== row.shareId)
    } else {
      shareIds = selectedRowKeys.join(PanEnum.COMMON_SEPARATOR)
    }

    modal.confirm({
      title: '提示',
      cancelText: '取消',
      okText: '确定',
      closable: true,
      content: <div style={{ marginBottom: 10 }}>{`分享取消后将不可恢复，您确定这样做吗？`}</div>,
      async onOk() {
        await cancelShareApi(shareIds)
        message.success('取消分享成功')
        setSelectedRowKeys(newKeys)
        loadData()
      }
    })
  }

  const columns: TableColumnsType = [
    {
      title: '分享名称',
      dataIndex: 'shareName',
      fixed: 'left',
      minWidth: 360,
      align: 'left'
    },
    {
      dataIndex: 'operator',
      minWidth: 200,
      align: 'center',
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
                onClick={e => onCopyLink(e, row)}
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
      dataIndex: 'shareUrl',
      minWidth: 200,
      align: 'center',
      render: value => (
        <a target={'_blank'} href={value}>
          {value.slice(0, 30)}...
        </a>
      )
    },
    {
      title: '提取码',
      dataIndex: 'shareCode',
      minWidth: 100,
      align: 'center'
    },
    {
      title: '分享时间',
      dataIndex: 'createTime',
      minWidth: 120,
      align: 'center'
    },
    {
      title: '分享状态',
      dataIndex: 'shareEndTime',
      minWidth: 120,
      align: 'center',
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
          onClick={() => onCancelShare()}
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

export default Share
