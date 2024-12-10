'use client'

import { Button, Divider } from 'antd'
import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'

import styles from './styles.module.scss'

const BreadcrumbFC = () => {
  const { breadcrumbList } = useAppSelector(
    state => ({
      breadcrumbList: state.file.breadcrumbList
    }),
    shallowEqualApp
  )

  return (
    <section className={styles.root}>
      <Button className={styles.backBtn} type='link'>
        返回
      </Button>

      {/* 分割线 */}
      <Divider type='vertical' className={styles.divider} />

      <ul className={styles.list}>
        {breadcrumbList.map((item, index) => (
          <li className={styles.item} key={index}>
            <a className={styles.text} href='#'>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default BreadcrumbFC
