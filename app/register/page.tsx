'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, Input } from 'antd'
import type { InputRef } from 'antd'
import { useRouter } from 'next/navigation'

import styles from './register.module.scss'

import { message } from '@/lib/AntdGlobal'
import { validateUsernameAndPassword } from '@/lib/form-validate'
import { registerApi } from '@/api/modules/user'

export default function LoginFC() {
  const router = useRouter()
  const usernameRef = useRef<InputRef | null>(null)

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [okPassword, setOkPassword] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  // 聚焦输入框
  useEffect(() => {
    const usernameEl = usernameRef.current as any
    usernameEl.focus()
  }, [])

  // 跳转到注册页面
  const jumpLogin = () => {
    router.push('/login')
  }

  // 监听登录点击
  const onRegister = async () => {
    if (loading) {
      return
    }

    if (!validateUsernameAndPassword(username, password)) {
      return
    }

    if (password !== okPassword) {
      if (!okPassword) {
        return message.warning('请输入确认密码')
      }
      return message.warning('两次密码输入不一致')
    }

    if (!question) {
      return message.warning('请填写密码问题')
    }

    if (!answer) {
      return message.warning('请填写密码答案')
    }

    setLoading(true)

    const data = {
      username,
      password,
      question,
      answer
    }

    await registerApi(data)

    message.success('注册成功')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }

  return (
    <main className={styles.root}>
      <article className={styles.content}>
        {/* 去登陆 */}
        <section className={styles.leftLogin}>
          <div className={styles.title}>
            <h2>已有账户？</h2>
            <div>有账号就登陆吧，好久不见啦！</div>
          </div>
          <nav className={styles.link} onClick={jumpLogin}>
            去登陆
          </nav>
        </section>

        {/* 注册表单 */}
        <section className={styles.leftForm}>
          <h2 className={styles.title}>注册</h2>
          <div className={styles.form}>
            {/* 用户名 */}
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

            {/* 密码 */}
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

            {/* 确认密码 */}
            <label>
              <span>确认密码</span>
              <Input.Password
                style={{ position: 'relative', left: 3 }}
                rootClassName={styles.input}
                variant={'borderless'}
                value={okPassword}
                onChange={e => setOkPassword(e.target.value)}
              />
            </label>

            {/* 密保问题 */}
            <label>
              <span>密保问题</span>
              <Input
                allowClear
                style={{ position: 'relative', left: 3 }}
                rootClassName={styles.input}
                size={'small'}
                variant={'borderless'}
                value={question}
                onChange={e => setQuestion(e.target.value)}
              />
            </label>

            {/* 密保答案 */}
            <label>
              <span>密保答案</span>
              <Input
                allowClear
                style={{ position: 'relative', left: 3 }}
                rootClassName={styles.input}
                size={'small'}
                variant={'borderless'}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
              />
            </label>

            {/* 注册按钮 */}
            <Button
              size={'large'}
              type={'primary'}
              shape={'round'}
              style={{ width: 280, position: 'relative', left: 3 }}
              onClick={onRegister}
              loading={loading}
              className={styles.registerBtn}
            >
              注 册
            </Button>
          </div>
        </section>
      </article>
    </main>
  )
}
