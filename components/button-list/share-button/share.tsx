'use client'

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Button, Form, Input, type InputRef, Modal, Radio, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'

import { PanEnum } from '@/lib/constants'
import { shareApi } from '@/api/features/file'
import { FileItem } from '@/types/file'

import styles from './styles.module.scss'
import { CopyOutlined } from '@ant-design/icons'
import { copyText2Clipboard } from '@/lib/utils/base.util'
import { message } from '@/lib/AntdGlobal'

const ShareFC = forwardRef((_, ref) => {
  const shareNameRef = useRef<InputRef | null>(null)
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(1)
  const [rows, setRows] = useState<FileItem[] | null>(null)
  const [shareResult, setShareResult] = useState<Record<string, any>>()
  const [form] = useForm()

  // 分享文件名等
  const simpleFilename = useMemo(() => {
    const names = rows?.map(item => item.filename).join(', ')
    const minName = `${names?.slice(0, 32)}`
    return minName.length >= 30 ? minName + '...' : minName
  }, [rows])

  const open = (rows: FileItem[]) => {
    setRows(rows)
    setVisible(true)
  }

  const close = () => {
    form.resetFields()
    setVisible(false)
    setStep(1)
  }

  useEffect(() => {
    setTimeout(() => {
      shareNameRef.current?.focus()
    })
  }, [visible])

  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  const onCancel = () => {
    close()
  }

  const onOk = async () => {
    await form.validateFields()
    const fieldsValue = form.getFieldsValue()
    const shareFileIds = rows?.map(row => row.fileId).join(PanEnum.COMMON_SEPARATOR)
    const data = {
      ...fieldsValue,
      shareFileIds
    }
    const result = await shareApi(data)
    setStep(2)
    setShareResult(result)
  }

  const onCopyText = () => {
    const text = `链接：${shareResult?.shareUrl}  提取码：${shareResult?.shareCode}  赶快分享给小伙伴吧！`
    copyText2Clipboard(text)
    message.info('已复制').then(() => {})
  }

  const modalProps: Record<string, any> = {
    footer: step === 1
  }
  if (modalProps.footer) delete modalProps.footer

  return (
    <Modal
      {...modalProps}
      width={620}
      title={step === 1 ? `分享文件（${simpleFilename}）` : ''}
      maskClosable={false}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      {step === 1 ? (
        <Form
          initialValues={{ shareType: '0', shareDayType: '0' }}
          labelCol={{ span: 5 }}
          style={{ padding: '30px 0 10px 0' }}
          form={form}
          autoComplete='off'
        >
          <Form.Item label='分享名称' name='shareName' rules={[{ required: true, message: '请输入分享名称' }]}>
            <Input ref={shareNameRef} />
          </Form.Item>
          <Form.Item label='分享类型' name='shareType'>
            <Radio.Group disabled={true}>
              <Radio value='0'> 有提取码 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label='分享有效期' name='shareDayType'>
            <Select>
              <Select.Option value='0'>永久有效</Select.Option>
              <Select.Option value='1'>7天有效</Select.Option>
              <Select.Option value='2'>30天有效</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      ) : step === 2 ? (
        <section>
          <div className={styles.title}>恭喜你，分享成功！</div>
          <div className={styles.link}>
            <span>分享链接：</span>
            <span className={styles.value}>{shareResult?.shareUrl}</span>
          </div>
          <div className={styles.code}>
            <span>提取码：</span>
            <span className={styles.value}>{shareResult?.shareCode}</span>
          </div>
          <div className={styles.copyBtn}>
            <Button type={'primary'} icon={<CopyOutlined />} onClick={onCopyText}>
              点击复制
            </Button>
          </div>
        </section>
      ) : null}
    </Modal>
  )
})

ShareFC.displayName = 'ShareFC'

export default ShareFC
