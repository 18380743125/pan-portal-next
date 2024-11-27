'use client'

import { Button } from 'antd'
import Breadcrumb from '@/components/breadcrumb'
import FileTable from '@/components/file-table'

import styles from './styles.module.scss'

export default function Home() {
  return (
    <main className={styles.root}>
      <section className={styles.topButtonGroup}>
        <Button type={'primary'} shape={'round'}>
          上传
        </Button>
      </section>

      <section className={styles.breadcrumb}>
        <Breadcrumb />
      </section>

      <section className={styles.fileList}>
        <FileTable />
      </section>
    </main>
  )
}
