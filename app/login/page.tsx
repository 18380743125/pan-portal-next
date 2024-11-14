'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, Input } from 'antd'
import type { InputRef } from 'antd'
import { useRouter } from 'next/navigation'

import styles from './login.module.scss'

import { validatePassword, validateUsername } from '@/lib/utils/regex.util'
import { message } from '@/lib/AntdGlobal'
import { useAppDispatch } from '@/lib/store/hooks'
import { loginAction } from '@/lib/store/features/userSlice'

export default function LoginFC() {
  const router = useRouter()
  const usernameRef = useRef<InputRef | null>(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useAppDispatch()

  // 聚焦输入框
  useEffect(() => {
    const usernameEl = usernameRef.current as any
    usernameEl.focus()
  }, [])

  // 跳转到忘记密码页面
  const jumpForget = () => {
    router.push('/forget')
  }

  // 跳转到注册页面
  const jumpRegister = () => {
    router.push('/register')
  }

  // 监听登录点击
  const onLogin = () => {
    if (!username || !validateUsername(username)) {
      if (!username) return message.warning('请输入用户名')
      return message.warning('请输入6到16位的用户名，其中包含字母和数字')
    }

    if (!password || !validatePassword(password)) {
      if (!password) {
        return message.warning('请输入密码')
      }
      return message.warning('密码必须至少8个字符，包含大写字母、小写字母、数字和特殊字符 !@#$%^&*()')
    }

    dispatch(loginAction({ username, password }))
  }

  return (
    <main className={styles.root}>
      <article className={styles.content}>
        {/* 表单区域 */}
        <section className={styles.leftForm}>
          <h2 className={styles.title}>登陆</h2>
          <div className={styles.form}>
            <label>
              <span>用户名</span>
              <Input
                allowClear
                style={{ position: 'relative', left: 3 }}
                rootClassName={styles.input}
                ref={usernameRef}
                size={'small'}
                variant={'borderless'}
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </label>
            <label>
              <span>密码</span>
              <Input.Password
                style={{ position: 'relative', left: 3 }}
                rootClassName={styles.input}
                variant={'borderless'}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </label>
            <nav className={styles.forgetPass} onClick={jumpForget}>
              忘记密码？
            </nav>
            <Button
              size={'large'}
              type={'primary'}
              shape={'round'}
              style={{ width: 280, position: 'relative', left: 3 }}
              onClick={onLogin}
            >
              登 陆
            </Button>
          </div>
        </section>

        {/* 右侧注册链接 */}
        <section className={styles.rightRegister}>
          <div className={styles.title}>
            <h2>还未注册？</h2>
            <div>立即注册，享受独有空间！</div>
          </div>
          <nav className={styles.link} onClick={jumpRegister}>
            去注册
          </nav>
        </section>
      </article>
    </main>
  )
}
