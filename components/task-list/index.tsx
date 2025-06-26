'use client'

import { SwapOutlined } from '@ant-design/icons'
import { Badge, Popover } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'
import TaskList from './task-list'

import styles from './styles.module.scss'

let toggleTaskList: any = null

const TaskListFC = () => {
  const { taskList } = useAppSelector(
    state => ({
      taskList: state.task.taskList
    }),
    shallowEqualApp
  )

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    toggleTaskList = setVisible
  }, [])

  const badgeNum = useMemo(() => {
    return taskList.length || ''
  }, [taskList])

  const handleOpenChange = (newOpen: boolean) => {
    setVisible(newOpen)
  }

  return (
    <Popover
      open={visible}
      onOpenChange={handleOpenChange}
      placement={'bottomRight'}
      trigger={'click'}
      content={<TaskList />}
    >
      <Badge count={badgeNum}>
        <main className={styles.root}>
          <SwapOutlined />
        </main>
      </Badge>
    </Popover>
  )
}

// 打开任务列表气泡卡片
export const openTaskList = () => {
  toggleTaskList(true)
}

export const closeTaskList = () => {
  toggleTaskList(false)
}

export default TaskListFC
