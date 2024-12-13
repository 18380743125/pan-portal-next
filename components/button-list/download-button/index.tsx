import { Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import useFileHandler from '@/hooks/useFileHandler'

import styles from './styles.module.scss'

const DownloadButton = () => {
  const { onDownload } = useFileHandler()

  return (
    <Button
      className={styles.button}
      type={'primary'}
      shape={'round'}
      icon={<DownloadOutlined />}
      iconPosition={'end'}
      onClick={() => onDownload()}
    >
      下载
    </Button>
  )
}

export default DownloadButton
