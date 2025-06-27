'use client'

import { CopyOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRef } from 'react'
import { toast } from 'sonner'

import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'
import { FileItem } from '@/types/file'
import Copy from './copy'

import styles from './styles.module.scss'

const CopyButton = () => {
  const copyRef = useRef<{ open: (rows: FileItem[]) => void }>(null)

  const { selectFileList } = useAppSelector(
    state => ({
      selectFileList: state.file.selectFileList
    }),
    shallowEqualApp
  )

  const onCopy = () => {
    if (!selectFileList?.length) {
      return toast.warning('请选择要复制的文件')
    }
    copyRef.current?.open(selectFileList)
  }
  return (
    <>
      <Copy ref={copyRef} />
      <Button
        className={styles.button}
        type={'primary'}
        shape={'round'}
        icon={<CopyOutlined />}
        iconPosition={'end'}
        onClick={onCopy}
      >
        复制到
      </Button>
    </>
  )
}

export default CopyButton
