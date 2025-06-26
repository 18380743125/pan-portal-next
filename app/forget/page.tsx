'use client'

import { Button, Input, Steps } from 'antd'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import styles from './styles.module.scss'

import { checkAnswerApi, checkUsernameApi, resetPasswordApi } from '@/api/features/user'

import { message } from '@/lib/AntdGlobal'
import { validatePassword, validateUsername } from '@/lib/utils/form-validate'

const stepList = [
  {
    title: '校验用户名',
    key: 'username'
  },
  {
    title: '校验密保答案',
    key: 'answer'
  },
  {
    title: '重置密码',
    key: 'submit'
  }
]

export default function LoginFC() {
  const router = useRouter()

  // 当前步骤进度索引
  const [currentStep, setCurrentStep] = useState(0)

  // 表单字段
  const [username, setUsername] = useState('')
  const [answer, setAnswer] = useState('')
  const [password, setPassword] = useState('')
  const [okPassword, setOkPassword] = useState('')
  const [question, setQuestion] = useState('')
  const [token, setToken] = useState('') // 重置密码 token

  const title = useMemo(() => stepList[currentStep].title, [currentStep])

  const onOperator = () => {
    const stepKey = stepList[currentStep].key
    switch (stepKey) {
      case 'username':
        checkUsername()
        break
      case 'answer':
        checkAnswer()
        break
      case 'submit':
        handleSubmit()
        break
      default:
        break
    }
  }

  const checkUsername = async () => {
    if (!validateUsername(username)) {
      return
    }
    const result = await checkUsernameApi({ username })
    setQuestion(result)
    setCurrentStep(currentStep + 1)
  }

  const checkAnswer = async () => {
    if (!answer) {
      return message.warning('请填写密保答案')
    }
    const result = await checkAnswerApi({
      username,
      question,
      answer
    })
    setToken(result)
    setCurrentStep(currentStep + 1)
  }

  const handleSubmit = async () => {
    if (!validatePassword(password)) {
      return
    }

    if (!okPassword || password !== okPassword) {
      if (!okPassword) {
        message.warning('请填写确认密码')
      } else {
        message.warning('两次密码输入不一致')
      }
      return
    }

    try {
      await resetPasswordApi({
        username,
        password,
        token
      })
      message.success('重置密码成功')
      setTimeout(() => {
        jumpLogin()
      }, 2000)
    } catch (error: any) {
      if (error?.message === 'TOKEN_EXPIRE') {
        message.error('由于您长时间未操作，将重新校验用户名')
        setTimeout(() => {
          setCurrentStep(0)
          setUsername('')
          setPassword('')
          setOkPassword('')
          setQuestion('')
          setAnswer('')
          setToken('')
        }, 3000)
        return
      }
    }
  }

  const jumpLogin = () => {
    router.push('/login')
  }

  return (
    <main className={styles.root}>
      <article className={styles.content}>
        {/* 步骤条 */}
        <section className={styles.left}>
          <Steps className={styles.stepList} direction='vertical' current={currentStep} items={stepList} />
        </section>

        <section className={styles.right}>
          {/* title */}
          <h2 className={styles.title}>{title}</h2>

          {/* 表单 */}
          <div className={styles.form}>
            {/* 用户名 */}
            {currentStep === 0 && (
              <label>
                <span>用户名</span>
                <Input
                  allowClear
                  style={{ position: 'relative', left: 3 }}
                  rootClassName={styles.input}
                  size={'small'}
                  variant={'borderless'}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </label>
            )}

            {/* 密保答案 */}
            {currentStep === 1 && (
              <>
                <label>
                  <span>您的密保问题为</span>
                  <div>{question}</div>
                </label>

                {/* 密保答案 */}
                <label>
                  <span>请输入您的密保答案</span>
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
              </>
            )}

            {/* 重置密码 */}
            {currentStep === 2 && (
              <>
                <label>
                  <span>新密码</span>
                  <Input.Password
                    style={{ position: 'relative', left: 3 }}
                    rootClassName={styles.input}
                    size={'small'}
                    variant={'borderless'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </label>
                <label style={{ marginTop: 40 }}>
                  <span>确认密码</span>
                  <Input.Password
                    style={{ position: 'relative', left: 3 }}
                    rootClassName={styles.input}
                    size={'small'}
                    variant={'borderless'}
                    value={okPassword}
                    onChange={e => setOkPassword(e.target.value)}
                  />
                </label>
              </>
            )}

            {/* 操作按钮 */}
            <Button
              size={'large'}
              type={'primary'}
              shape={'round'}
              style={{ width: 280, position: 'relative', left: 3 }}
              className={styles.operatorButton}
              onClick={onOperator}
            >
              {currentStep < stepList.length - 1 ? '下一步' : '提交'}
            </Button>

            <Button
              onClick={jumpLogin}
              style={{ position: 'absolute', display: 'inline-block', right: 40, bottom: 62 }}
              type='link'
            >
              去登陆
            </Button>
          </div>
        </section>
      </article>
    </main>
  )
}
