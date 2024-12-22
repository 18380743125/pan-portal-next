'use client'

import { useMemo } from 'react'
import { Badge, Popover } from 'antd'
import { SwapOutlined } from '@ant-design/icons'

import TaskList from './task-list'
import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'

import styles from './styles.module.scss'

const TaskListFC = () => {
  const { taskList } = useAppSelector(
    state => ({
      taskList: state.task.taskList
    }),
    shallowEqualApp
  )

  const badgeNum = useMemo(() => {
    return taskList.length || ''
  }, [taskList])

  return (
    <Popover placement={'bottomRight'} trigger={'click'} content={<TaskList />}>
      <Badge count={badgeNum}>
        <main className={styles.root}>
          <SwapOutlined />
        </main>
      </Badge>
    </Popover>
  )
}

export default TaskListFC
