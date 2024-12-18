'use client'

import { useRef } from 'react'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import RenameFC from '@/components/button-list/rename-button/rename'
import { FileItem } from '@/types/file'
import styles from './styles.module.scss'
import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'
import { message } from '@/lib/AntdGlobal'

const RenameButton = () => {
  const { selectFileList } = useAppSelector(
    state => ({
      selectFileList: state.file.selectFileList
    }),
    shallowEqualApp
  )

  const renameRef = useRef<{ open: (row?: FileItem) => void }>(null)

  const onRename = () => {
    if (!selectFileList?.length) {
      return message.warning('请选择要重命名的文件')
    }
    if (selectFileList.length > 1) {
      return message.warning('请选择一个文件进行重命名')
    }
    renameRef.current?.open(selectFileList[0])
  }
  return (
    <>
      <RenameFC ref={renameRef} />
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
