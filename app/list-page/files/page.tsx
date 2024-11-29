import Breadcrumb from '@/components/breadcrumb'
import FileTable from '@/components/file-table'

import FileButtonGroupFC from '@/components/file-button-group'
import SearchFC from '@/components/search'

import styles from './styles.module.scss'

export default function Home() {
  return (
    <main className={styles.root}>
      {/* 头部区域 */}
      <section className={styles.topButtonGroup}>
        <FileButtonGroupFC />
        <SearchFC />
      </section>

      {/* 面包屑 */}
      <section className={styles.breadcrumb}>
        <Breadcrumb />
      </section>
      {/* 文件列表 */}
      <section className={styles.fileList}>
        <FileTable />
      </section>
    </main>
  )
}
