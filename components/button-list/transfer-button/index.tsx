'use client'

import { SendOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRef } from 'react'
import { toast } from 'sonner'

import Transfer from './transfer'

import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'
import { type FileItem } from '@/types/file'

const TransferButton = () => {
  const moveRef = useRef<{ open: (rows: FileItem[]) => void }>(null)

  const { selectFileList } = useAppSelector(
    state => ({
      selectFileList: state.file.selectFileList
    }),
    shallowEqualApp
  )

  const onTransfer = () => {
    if (!selectFileList?.length) {
      return toast.warning('请选择要移动的文件')
    }
    moveRef.current?.open(selectFileList)
  }
  return (
    <>
      <Transfer ref={moveRef} />
      <Button type={'default'} shape={'round'} icon={<SendOutlined />} iconPosition={'end'} onClick={onTransfer}>
        移动到
      </Button>
    </>
  )
}

export default TransferButton
