'use client'

import { EditOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRef } from 'react'
import { toast } from 'sonner'

import Rename from './rename'

import { useFileStore } from '@/lib/store/fileStore'
import { FileItem } from '@/types/file'

import styles from './styles.module.scss'

const RenameButton = () => {
  const { selectFileList } = useFileStore()

  const renameRef = useRef<{ open: (row?: FileItem) => void }>(null)

  const onRename = () => {
    if (!selectFileList?.length) {
      return toast.warning('请选择要重命名的文件')
    }
    if (selectFileList.length > 1) {
      return toast.warning('请选择一个文件进行重命名')
    }
    renameRef.current?.open(selectFileList[0])
  }
  return (
    <>
      <Rename ref={renameRef} />
      <Button
        className={styles.button}
        type={'primary'}
        shape={'round'}
        icon={<EditOutlined />}
        iconPosition={'end'}
        onClick={onRename}
      >
        重命名
      </Button>
    </>
  )
}

export default RenameButton
