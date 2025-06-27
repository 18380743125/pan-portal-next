'use client'

import { App } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'
import { ModalStaticFunctions } from 'antd/es/modal/confirm'
import { NotificationInstance } from 'antd/es/notification/interface'

let message: MessageInstance
let notification: NotificationInstance
let modal: Omit<ModalStaticFunctions, 'warn'>

export default () => {
  const staticFunction = App.useApp()

  message = staticFunction.message
  notification = staticFunction.notification
  modal = staticFunction.modal

  return null
}

export { message, modal, notification }

