'use client'

import { Button } from 'antd'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { increment } from '@/lib/store/features/counterSlice'
import styles from './app.module.scss'

export default function Home() {
  const dispatch = useAppDispatch()

  const { count } = useAppSelector(
    state => ({
      count: state.counter.value
    }),
    shallowEqualApp
  )

  const handleClick = () => {
    dispatch(increment(1))
  }

  return (
    <div className={styles.app}>
      <h1 className={styles.wrapper}>{count}</h1>
      <Button type='primary' onClick={handleClick}>
        Button
      </Button>
    </div>
  )
}
