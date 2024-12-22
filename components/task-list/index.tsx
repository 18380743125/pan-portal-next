import { Popover } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import TaskList from './task-list'

import styles from './styles.module.scss'

const TaskListFC = () => {
  return (
    <Popover placement={'bottomRight'} trigger={'click'} content={<TaskList />}>
      <main className={styles.root}>
        <SwapOutlined />
      </main>
    </Popover>
  )
}

export default TaskListFC
