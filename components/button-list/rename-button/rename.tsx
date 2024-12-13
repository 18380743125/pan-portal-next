'use client'

import { forwardRef, useImperativeHandle, useState } from 'react'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'

import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { renameApi } from '@/api/features/file'
import { message } from '@/lib/AntdGlobal'
import { getFileAction } from '@/lib/store/features/fileSlice'
import { FileItem } from '@/types/file'

const RenameFC = forwardRef((_, ref) => {
  const dispatch = useAppDispatch()

  const { fileType, pathList } = useAppSelector(
    state => ({
      fileType: state.file.fileType,
      pathList: state.file.breadcrumbList
    }),
    shallowEqualApp
  )

  const [visible, setVisible] = useState(false)
  const [row, setRow] = useState<FileItem | null>(null)
  const [form] = useForm()

  const open = (row: FileItem) => {
    setVisible(true)
    setRow(row)
    form.setFieldValue('newFilename', row.filename)
  }

  const close = () => {
    form.resetFields()
    setRow(null)
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
    if (!row) {
      return
    }
    await form.validateFields()
    const data = form.getFieldsValue()
    await renameApi(row?.fileId, data.newFilename)
    message.success('重命名成功')
    // 刷新列表
    const current = pathList[pathList.length - 1]
    dispatch(getFileAction({ parentId: current.parentId, fileType }))
    close()
  }

  return (
    <Modal title='重命名文件' maskClosable={false} open={visible} onOk={onOk} onCancel={onCancel}>
      <Form style={{ padding: '30px 0 10px 0' }} form={form} autoComplete='off'>
        <Form.Item label='文件名称' name='newFilename' rules={[{ required: true, message: '请输入新文件名称' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
})

RenameFC.displayName = 'RenameFC'

export default RenameFC
