'use client'

import React from 'react'
import { Button, Popover, Progress, Table, TableColumnsType } from 'antd'
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeploymentUnitOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
  RedoOutlined,
  UploadOutlined,
  WarningOutlined
} from '@ant-design/icons'

import { cancelTaskAction, pauseTaskAction, resumeTaskAction, retryTaskAction } from '@/lib/store/features/taskSlice'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { fileStatus } from '@/lib/utils/file-util'
import styles from './styles.module.scss'

const TaskListFC = () => {
  const dispatch = useAppDispatch()
  const { taskList } = useAppSelector(
    state => ({
      taskList: state.task.taskList
    }),
    shallowEqualApp
  )

  // 控制文件上床
  const onToggleTask = (action: string, row: Record<string, any>) => {
    const { filename } = row
    switch (action) {
      case 'pause':
        dispatch(pauseTaskAction(filename))
        break
      case 'resume':
        dispatch(resumeTaskAction(filename))
        break
      case 'cancel':
        dispatch(cancelTaskAction(filename))
        break
      case 'retry':
        dispatch(retryTaskAction(filename))
        break
      default:
        break
    }
  }

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
            <Progress percent={row.percentage} size='small' />
          </Popover>
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      render(_, row) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {row.status === fileStatus.PAUSE.code && (
              <Popover trigger={'hover'} placement={'top'} content={'继续上传'}>
                <Button
                  type={'link'}
                  size={'middle'}
                  icon={<PlayCircleFilled />}
                  onClick={() => onToggleTask('resume', row)}
                />
              </Popover>
            )}

            {row.status === fileStatus.UPLOADING.code && (
              <Popover trigger={'hover'} placement={'top'} content={'暂停上传'}>
                <Button
                  type={'link'}
                  size={'middle'}
                  icon={<PauseCircleOutlined />}
                  onClick={() => onToggleTask('pause', row)}
                />
              </Popover>
            )}

            {row.status === fileStatus.FAIL.code && (
              <Popover trigger={'hover'} placement={'top'} content={'重新上传'}>
                <Button
                  type={'link'}
                  size={'middle'}
                  style={{ color: '#919191' }}
                  icon={<RedoOutlined />}
                  onClick={() => onToggleTask('retry', row)}
                />
              </Popover>
            )}

            {row.status !== fileStatus.SUCCESS && (
              <Popover trigger={'hover'} placement={'top'} content={'取消上传'}>
                <Button
                  type={'link'}
                  size={'middle'}
                  style={{ color: '#919191' }}
                  icon={<CloseCircleOutlined />}
                  onClick={() => onToggleTask('cancel', row)}
                />
              </Popover>
            )}
          </div>
        )
      }
    }
  ]

  return (
    <main className={styles.taskList}>
      <Table
        style={{ width: 600 }}
        scroll={{ y: 300 }}
        rowKey='filename'
        pagination={false}
        columns={columns}
        dataSource={taskList}
      />
    </main>
  )
}

export default TaskListFC
