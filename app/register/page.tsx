'use client'

import { Button, Input, type InputRef } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import styles from './styles.module.scss'

import { registerApi } from '@/api/features/user'

import { validateUsernameAndPassword } from '@/lib/utils/form-validate'

export default function RegisterFC() {
  const router = useRouter()
  const inputRef = useRef<InputRef | null>(null)

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [okPassword, setOkPassword] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  // 聚焦输入框
  useEffect(() => {
    const inputDOM = inputRef.current
    inputDOM && inputDOM.focus()
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
        return toast.warning('请填写确认密码')
      }
      return toast.warning('两次密码输入不一致')
    }

    if (!question) {
      return toast.warning('请填写密保问题')
    }

    if (!answer) {
      return toast.warning('请填写密保答案')
    }

    setLoading(true)

    const data = {
      username,
      password,
      question,
      answer
    }

    await registerApi(data)

    toast.success('注册成功')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }

  return (
    <main className={styles.root}>
      <article className={styles.content}>
        {/* 去登陆 */}
        <section className={styles.leftRegister}>
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
                ref={inputRef}
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
