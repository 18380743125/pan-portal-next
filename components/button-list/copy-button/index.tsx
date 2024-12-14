import { Button } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import CopyFC from '@/components/button-list/copy-button/copy'
import { useRef } from 'react'
import { FileItem } from '@/types/file'
import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'
import { message } from '@/lib/AntdGlobal'
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
      return message.warning('请选择要复制的文件')
    }
    copyRef.current?.open(selectFileList)
  }
  return (
    <>
      <CopyFC ref={copyRef} />
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
