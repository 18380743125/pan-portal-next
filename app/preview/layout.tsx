import AppHeader from '@/components/header'
import styles from './styles.module.scss'

function PreviewLayout({ children }) {
  return (
    <>
      <AppHeader showTaskList={false} />
      <main className={styles.root}>{children}</main>
    </>
  )
}

export default PreviewLayout
