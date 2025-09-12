import { AntdRegistry } from '@ant-design/nextjs-registry'
import { App as AntdApp, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import type { Metadata } from 'next'
import React from 'react'
import { Toaster } from 'sonner'
import '@ant-design/v5-patch-for-react-19'

// fontawesome
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'normalize.css'

import '@/styles/common.css'

import AntdGlobal from '@/lib/AntdGlobal'

library.add(fas)
config.autoAddCss = false

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = {
    token: {
      colorPrimary: '#409EFF'
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
        <ConfigProvider locale={zhCN} theme={theme}>
          <AntdApp>
            <Toaster richColors closeButton />
            <AntdGlobal />
            <AntdRegistry>{children}</AntdRegistry>
          </AntdApp>
        </ConfigProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: '迅翼网盘',
  description: '极速传输，畅享高效文件私享空间'
}
