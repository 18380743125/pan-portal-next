import TaskList from '@/components/task-list'
import UserInfo from '@/components/user-info'

import styles from './styles.module.scss'

const AppHeaderFC = () => {
  return (
    <main className={styles.root}>
      <section className={styles.left}>我的网盘</section>

      <section className={styles.right}>
        <TaskList />
        <UserInfo />
      </section>
    </main>
  )
}

export default AppHeaderFC
