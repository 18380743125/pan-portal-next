'use client'

import React from 'react'
import { Button, Popover, Progress, Table, TableColumnsType } from 'antd'

import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'

import styles from './styles.module.scss'
import { fileStatus } from '@/lib/utils/status.util'
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeploymentUnitOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  UploadOutlined,
  WarningOutlined
} from '@ant-design/icons'

const TaskListFC = () => {
  const { taskList } = useAppSelector(
    state => ({
      taskList: state.task.taskList
    }),
    shallowEqualApp
  )

  console.log(taskList)

  const columns: TableColumnsType = [
    {
      title: '文件名称',
      dataIndex: 'filename',
      width: 120,
      align: 'center',
      ellipsis: {
        showTitle: true
      },
      render: filename => (
        <Popover placement='top' content={filename}>
          {filename}
        </Popover>
      )
    },
    {
      title: '文件状态',
      align: 'center',
      width: 120,
      render(_, row) {
        return (
          <Popover trigger={'hover'} placement={'top'} content={row.statusText}>
            {row.status === fileStatus.WAITING.code && (
              <Button size={'small'} shape={'circle'} icon={<ClockCircleOutlined />} />
            )}

            {row.status === fileStatus.PAUSE.code && (
              <Button size={'small'} shape={'circle'} icon={<PlayCircleOutlined />} />
            )}

            {row.status === fileStatus.UPLOADING.code && (
              <Button size={'small'} shape={'circle'} icon={<UploadOutlined />} />
            )}

            {row.status === fileStatus.FAIL.code && (
              <Button size={'small'} shape={'circle'} icon={<WarningOutlined />} />
            )}

            {row.status === fileStatus.PARSING.code && (
              <Button size={'small'} shape={'circle'} icon={<LoadingOutlined />} />
            )}

            {row.status === fileStatus.MERGE.code && (
              <Button size={'small'} shape={'circle'} icon={<DeploymentUnitOutlined />} />
            )}
          </Popover>
        )
      }
    },
    {
      title: '上传进度',
      align: 'center',
      width: 180,
      render(_, row) {
        return (
          <Popover
            trigger='hover'
            placement='top'
            content={
              <div style={{ lineHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <p>上传速度: {row.speed}</p>
                <p>
                  上传大小: {row.uploadedSize}/{row.fileSize}
                </p>
                <p>剩余时间: {row.timeRemaining}</p>
              </div>
            }
          >
            <Progress strokeWidth={8} percent={row.percentage} size='small' />
          </Popover>
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      render(_, row) {
        return (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {row.status === fileStatus.PAUSE ? (
              <Button
                type={'primary'}
                style={{ color: '#7ec050' }}
                size={'small'}
                shape={'circle'}
                icon={<PlayCircleOutlined />}
              />
            ) : (
              <Button type={'primary'} size={'small'} shape={'circle'} icon={<PauseCircleOutlined />} />
            )}
            <Button type={'primary'} danger size={'small'} shape={'circle'} icon={<CloseCircleOutlined />} />
          </div>
        )
      }
    }
  ]

  return (
    <main className={styles.taskList}>
      <Table
        key={'filename'}
        style={{ width: 600 }}
        scroll={{ y: 300 }}
        rowKey='fileId'
        pagination={false}
        columns={columns}
        dataSource={taskList}
      />
    </main>
  )
}

export default TaskListFC
