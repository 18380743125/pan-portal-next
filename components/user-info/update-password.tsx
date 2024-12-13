import { forwardRef, useImperativeHandle, useState } from 'react'
import { Form, Modal, Input } from 'antd'
import { useRouter } from 'next/navigation'

import { updatePasswordApi } from '@/api/features/user'
import { message } from '@/lib/AntdGlobal'
import { useAppDispatch } from '@/lib/store/hooks'
import { validatePassword } from '@/lib/form-validate'
import { clearUserAction } from '@/lib/store/features/userSlice'

type FieldType = {
  oldPassword?: string
  newPassword?: string
  okPassword?: string
}

const UpdatePasswordFC = forwardRef((_, ref) => {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  const dispatch = useAppDispatch()

  const open = () => {
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  useImperativeHandle(ref, () => {
    return {
      open,
      close
    }
  })

  // 提交
  const onSubmit = async () => {
    await form.validateFields().catch(() => {})
    const { oldPassword, newPassword, okPassword } = form.getFieldsValue()

    if (!validatePassword(oldPassword) || !validatePassword(newPassword)) {
      return
    }

    if (newPassword !== okPassword) {
      return message.warning('两次密码输入不一致')
    }
    await updatePasswordApi({ oldPassword, newPassword })

    message.success('修改密码成功')

    setTimeout(() => {
      router.push('/login')
      dispatch(clearUserAction())
    }, 2000)
  }

  return (
    <Modal title='修改密码' maskClosable={false} open={visible} onCancel={close} onOk={onSubmit}>
      <Form
        form={form}
        style={{ padding: '30px 0 20px' }}
        labelCol={{ span: 5 }}
        onFinish={onSubmit}
        autoComplete='off'
      >
        <Form.Item<FieldType> label='旧密码' name='oldPassword' rules={[{ required: true, message: '请填写旧密码' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> label='新密码' name='newPassword' rules={[{ required: true, message: '请填写新密码' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label='确认密码'
          name='okPassword'
          rules={[{ required: true, message: '请填写确认密码' }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  )
})

UpdatePasswordFC.displayName = 'UpdatePasswordFC'

export default UpdatePasswordFC
