import { Button } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'

const CopyButton = () => {
  return (
    <Button className={styles.button} type={'primary'} shape={'round'} icon={<CopyOutlined />} iconPosition={'end'}>
      复制到
    </Button>
  )
}

export default CopyButton
