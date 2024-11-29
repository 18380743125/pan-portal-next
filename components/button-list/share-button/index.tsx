import { Button } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'

const ShareButton = () => {
  return (
    <Button className={styles.button} type={'primary'} shape={'round'} icon={<ShareAltOutlined />} iconPosition={'end'}>
      分享
    </Button>
  )
}

export default ShareButton
