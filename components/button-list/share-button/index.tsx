'use client'

import { ShareAltOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRef } from 'react'
import { toast } from 'sonner'

import Share from './share'

import { useFileStore } from '@/lib/store/fileStore'
import { type FileItem } from '@/types/file'

import styles from './styles.module.scss'

const ShareButton = () => {
  const shareRef = useRef<{ open: (rows: FileItem[]) => void }>(null)

  const { selectFileList } = useFileStore()

  const onShare = () => {
    if (!selectFileList?.length) {
      return toast.warning('请选择要分享的文件')
    }
    shareRef.current?.open(selectFileList)
  }

  return (
    <>
      <Share ref={shareRef} />
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
