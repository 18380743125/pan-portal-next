import AppHeader from '@/components/header'
import Sidebar from '@/components/sidebar'

import styles from './styles.module.scss'

function ListPageLayout({ children }) {
  return (
    <>
      <AppHeader />
      <main className={styles.root}>
        <section className={styles.left}>
          <Sidebar />
        </section>

        <section className={styles.right}>{children}</section>
      </main>
    </>
  )
}

export default ListPageLayout
