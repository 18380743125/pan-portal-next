'use client'

import { Button, Form, Input } from 'antd'

import styles from './login.module.scss'

export default function LoginFC() {
  return (
    <main className={styles.root}>
      <article className={styles.content}>
        {/* 表单 */}
        <section className={styles.leftForm}>
          <h2 className={styles.title}>登陆</h2>
          <div className={styles.form}>
            <label>
              <span>用户名</span>
              <Input
                style={{ position: 'relative', left: 6, width: 260 }}
                size={'small'}
                rootClassName={styles.input}
                variant={'borderless'}
              />
            </label>
            <label>
              <span>密码</span>
              <Input.Password
                style={{ position: 'relative', left: 2 }}
                rootClassName={styles.input}
                variant={'borderless'}
              />
            </label>
            <nav className={styles.forgetPass}>忘记密码？</nav>
            <Button size={'large'} type={'primary'} shape={'round'} style={{ width: 286 }}>
              登 陆
            </Button>
          </div>
        </section>

        <section className={styles.rightRegister}>
          <div className={styles.title}>
            <h2>还未注册？</h2>
            <div>立即注册，享受独有空间！</div>
          </div>

          <nav className={styles.link}>去注册</nav>
        </section>
      </article>
    </main>
  )
}
