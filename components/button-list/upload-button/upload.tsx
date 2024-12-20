'use client'

import { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'

import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { getFileAction } from '@/lib/store/features/fileSlice'

import styles from './styles.module.scss'
import { CloudUploadOutlined } from '@ant-design/icons'

const UploadFC = forwardRef((_, ref) => {
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
    // 刷新当前页面
    const current = pathList[pathList.length - 1]
    dispatch(getFileAction({ parentId: current.id, fileType }))
    close()
  }

  return (
    <Modal
      footer={null}
      width={640}
      title='文件上传'
      maskClosable={false}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <main className={styles.root}>
        <section className={styles.uploadContent}>
          <section className={styles.topIcon}>
            <CloudUploadOutlined />
          </section>

          <section className={styles.tips}>
            <span>将文件拖到此处，或</span>
            <a>点击上传</a>
          </section>
        </section>
      </main>
    </Modal>
  )
})

UploadFC.displayName = 'UploadFC'

export default UploadFC
