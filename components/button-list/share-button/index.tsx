import { Button } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

import ShareFC from '@/components/button-list/share-button/share'
import styles from './styles.module.scss'
import { useRef } from 'react'
import { shallowEqualApp, useAppSelector } from '@/lib/store/hooks'
import { message } from '@/lib/AntdGlobal'
import { FileItem } from '@/types/file'

const ShareButton = () => {
  const shareRef = useRef<{ open: (rows: FileItem[]) => void }>(null)

  const { selectFileList } = useAppSelector(
    state => ({
      selectFileList: state.file.selectFileList
    }),
    shallowEqualApp
  )

  const onShare = () => {
    if (!selectFileList?.length) {
      return message.warning('请选择要分享的文件')
    }
    shareRef.current?.open(selectFileList)
  }

  return (
    <>
      <ShareFC ref={shareRef} />
      <Button
        className={styles.button}
        type={'primary'}
        shape={'round'}
        icon={<ShareAltOutlined />}
        iconPosition={'end'}
        onClick={() => onShare()}
      >
        分享
      </Button>
    </>
  )
}

export default ShareButton
