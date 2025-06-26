'use client'

import { ExclamationCircleFilled } from '@ant-design/icons'
import { type InputRef, Button, Input } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import styles from './styles.module.scss'

import { message, modal } from '@/lib/AntdGlobal'
import { loginAction } from '@/lib/store/features/userSlice'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { localCache } from '@/lib/utils/common/cache'
import { validateUsernameAndPassword } from '@/lib/utils/form-validate'

function LoginPage() {
  const router = useRouter()
  const inputRef = useRef<InputRef | null>(null)

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { token } = useAppSelector(
    state => ({
      token: state.user.token
    }),
    shallowEqualApp
  )
  const dispatch = useAppDispatch()

  // 聚焦输入框
  useEffect(() => {
    const inputDOM = inputRef.current
    if (!inputDOM) {
      return
    }
    if (token) {
      modal.confirm({
        title: '提示',
        content: '当前您已登陆，您确定要重新登陆吗? ',
        icon: <ExclamationCircleFilled />,
        onOk() {
          inputDOM.focus()
          localCache.clear()
        },
        onCancel() {
          router.back()
        }
      })
      return
    }
    inputDOM.focus()
  }, [])

  // 跳转到忘记密码界面
  const jumpForget = () => {
    router.push('/forget')
  }

  // 跳转到注册界面
  const jumpRegister = () => {
    router.push('/register')
  }

  // 监听登录点击
  const onLogin = async () => {
    if (loading) {
      return
    }

    if (!validateUsernameAndPassword(username, password)) {
      return
    }

    setLoading(true)

    try {
      await dispatch(
        loginAction({
          username,
          password
        })
      ).unwrap()
      message.success('登录成功')
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (e) {
    } finally {
      setLoading(false)
    }
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
                ref={inputRef}
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
              loading={loading}
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

export default LoginPage
