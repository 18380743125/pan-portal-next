'use client'

import { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'

import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { message } from '@/lib/AntdGlobal'
import { getFileAction } from '@/lib/store/features/fileSlice'

const TransferFC = forwardRef((_, ref) => {
  const dispatch = useAppDispatch()

  const { pathList, fileType } = useAppSelector(
    state => ({
      fileType: state.file.fileType,
      pathList: state.file.breadcrumbList
    }),
    shallowEqualApp
  )
  const [visible, setVisible] = useState(false)
  const [form] = useForm()

  const open = () => {
    setVisible(true)
  }

  const close = () => {
    form.resetFields()
    setVisible(false)
  }

  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  const onCancel = () => {
    close()
  }

  const onOk = async () => {
    const current = pathList[pathList.length - 1]
    message.success('移动成功')
    dispatch(getFileAction({ parentId: current.parentId, fileType }))
    close()
  }

  return (
    <Modal title='移动文件' maskClosable={false} open={visible} onOk={onOk} onCancel={onCancel}>
      hello
    </Modal>
  )
})

TransferFC.displayName = 'TransferFC'

export default TransferFC
