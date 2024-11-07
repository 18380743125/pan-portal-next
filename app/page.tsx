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
      <Button type='primary' onClick={handleClick}>
        Button {count}
      </Button>
    </div>
  )
}
