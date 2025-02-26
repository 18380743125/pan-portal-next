import React from 'react'
import type { Metadata } from 'next'
import { ConfigProvider, App as AntdApp } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import 'normalize.css'
import zhCN from 'antd/locale/zh_CN'

// fontawesome
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

library.add(fas)
config.autoAddCss = false

import '@/styles/common.css'

// redux store
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
  title: '迅翼云盘',
  description: '极速传输，畅享高效文件私享空间'
}
