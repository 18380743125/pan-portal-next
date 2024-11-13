import React from 'react'
import type { Metadata } from 'next'
import { ConfigProvider, App as AntdApp } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import 'normalize.css'

import '@/styles/common.css'

import { StoreProvider } from './StoreProvider'
import AntdGlobal from '@/utils/AntdGlobal'

export const metadata: Metadata = {
  title: '我的网盘',
  description: '个人云盘'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <StoreProvider>
      <html lang='en'>
        <body>
          <ConfigProvider
            theme={{
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
            }}
          >
            <AntdApp>
              <AntdGlobal />
              <AntdRegistry>{children}</AntdRegistry>
            </AntdApp>
          </ConfigProvider>
        </body>
      </html>
    </StoreProvider>
  )
}
