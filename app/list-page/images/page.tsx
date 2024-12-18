import FileTable from '@/components/file-table'
import FileButtonGroupFC from '@/components/file-button-group'
import SearchFC from '@/components/search'

import styles from './styles.module.scss'

export default function ImagesFC() {
  return (
    <main className={styles.root}>
      {/* 头部区域 */}
      <section className={styles.topButtonGroup}>
        <FileButtonGroupFC />
        <SearchFC />
      </section>

      {/*  文件列表 */}
      <section className={styles.fileList}>
        <FileTable />
      </section>
    </main>
  )
}
