import AppHeaderFC from '@/components/header'
import Sidebar from '@/components/sidebar'

import styles from './styles.module.scss'

export default function ListPageLayout({ children }) {
  return (
    <>
      <AppHeaderFC />
      <main className={styles.root}>
        <section className={styles.left}>
          <Sidebar />
        </section>

        <section className={styles.right}>{children}</section>
      </main>
    </>
  )
}
