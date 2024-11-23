import React from 'react'
import type { Metadata } from 'next'
import { ConfigProvider, App as AntdApp } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import 'normalize.css'
import zhCN from 'antd/locale/zh_CN'

import '@/styles/common.css'

import { StoreProvider } from './StoreProvider'
import AntdGlobal from '@/lib/AntdGlobal'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = {
    token: {
      colorPrimary: '#4096ff'
    },
    components: {
      Menu: {
        itemHoverBg: '#d0e5f8',
        itemHoverColor: '#0387ff',
        itemBg: '#e7f0f7',
        subMenuItemBg: '#e7f0f7',
        itemSelectedBg: '#d0e5f8',
        itemColor: '#65728e',
        itemSelectedColor: '#0387ff'
      }
    }
  }

  return (
    <html lang='en'>
      <body>
        <StoreProvider>
          <ConfigProvider locale={zhCN} theme={theme}>
            <AntdApp>
              <AntdGlobal />
              <AntdRegistry>{children}</AntdRegistry>
            </AntdApp>
          </ConfigProvider>
        </StoreProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: '我的网盘',
  description: '个人云盘'
}
