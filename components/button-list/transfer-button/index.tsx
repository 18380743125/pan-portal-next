'use client'

import { Button } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { useRef } from 'react'

import TransferFC from '@/components/button-list/transfer-button/transfer'
import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'
import { message } from '@/lib/AntdGlobal'
import { FileItem } from '@/types/file'

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
      return message.warning('请选择要移动的文件')
    }
    moveRef.current?.open(selectFileList)
  }
  return (
    <>
      <TransferFC ref={moveRef} />
      <Button type={'default'} shape={'round'} icon={<SendOutlined />} iconPosition={'end'} onClick={onTransfer}>
        移动到
      </Button>
    </>
  )
}

export default TransferButton
