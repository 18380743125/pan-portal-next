import TaskList from '@/components/task-list'
import UserInfo from '@/components/user-info'

import styles from './styles.module.scss'

const AppHeader = () => {
  return (
    <main className={styles.root}>
      <section className={styles.left}>迅翼云盘</section>

      <section className={styles.right}>
        <TaskList />
        <UserInfo />
      </section>
    </main>
  )
}

export default AppHeader
