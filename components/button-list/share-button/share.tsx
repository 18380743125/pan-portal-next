'use client'

import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'

import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { message } from '@/lib/AntdGlobal'
import { getFileAction } from '@/lib/store/features/fileSlice'
import { FileItem } from '@/types/file'

const ShareFC = forwardRef((_, ref) => {
  const dispatch = useAppDispatch()

  const { fileType, pathList } = useAppSelector(
    state => ({
      fileType: state.file.fileType,
      pathList: state.file.breadcrumbList
    }),
    shallowEqualApp
  )
  const [visible, setVisible] = useState(false)
  const [rows, setRows] = useState<FileItem[] | null>(null)
  const [form] = useForm()

  const simpleFilename = useMemo(() => {
    const names = rows?.map(item => item.filename).join(', ')
    const minName = `${names?.slice(0, 32)}`
    console.log(minName.length)
    return minName.length >= 30 ? minName + '...' : minName
  }, [rows])

  const open = (rows: FileItem[]) => {
    setRows(rows)

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
    console.log(data)
    const current = pathList[pathList.length - 1]
    message.success('新建成功')
    dispatch(getFileAction({ parentId: current.parentId, fileType }))
    close()
  }

  return (
    <Modal title={`分享文件（${simpleFilename}）`} maskClosable={false} open={visible} onOk={onOk} onCancel={onCancel}>
      <Form style={{ padding: '30px 0 10px 0' }} form={form} autoComplete='off'>
        <Form.Item label='分享名称' name='folderName' rules={[{ required: true, message: '请输入文件夹名称' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
})

ShareFC.displayName = 'ShareFC'

export default ShareFC
