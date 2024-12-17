'use client'

import { forwardRef, useImperativeHandle, useState } from 'react'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'

import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { createFolderApi } from '@/api/features/file'
import { message } from '@/lib/AntdGlobal'
import { getFileAction } from '@/lib/store/features/fileSlice'

const CreateFolder = forwardRef((_, ref) => {
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
    await form.validateFields()
    const data = form.getFieldsValue()
    const current = pathList[pathList.length - 1]
    await createFolderApi(current.id, data.folderName)
    message.success('新建成功')
    dispatch(getFileAction({ parentId: current.id, fileType }))
    close()
  }

  return (
    <Modal title='新建文件夹' maskClosable={false} open={visible} onOk={onOk} onCancel={onCancel}>
      <Form style={{ padding: '30px 0 10px 0' }} form={form} autoComplete='off'>
        <Form.Item label='文件夹名称' name='folderName' rules={[{ required: true, message: '请输入文件夹名称' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
})

CreateFolder.displayName = 'CreateFolder'

export default CreateFolder
