import { Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'

const DownloadButton = () => {
  return (
    <Button className={styles.button} type={'primary'} shape={'round'} icon={<DownloadOutlined />} iconPosition={'end'}>
      下载
    </Button>
  )
}

export default DownloadButton
