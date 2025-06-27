'use client'

import { FolderAddOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRef } from 'react'

import CreateFolder from './create-folder'

import styles from './styles.module.scss'

const CreateFolderButton = () => {
  const createRef = useRef<{ open: () => {} }>(null)

  const onCreate = () => {
    createRef.current?.open()
  }

  return (
    <>
      <CreateFolder ref={createRef} />

      <Button
        className={styles.button}
        type={'primary'}
        shape={'round'}
        icon={<FolderAddOutlined />}
        iconPosition={'end'}
        onClick={onCreate}
      >
        新建文件夹
      </Button>
    </>
  )
}

export default CreateFolderButton
