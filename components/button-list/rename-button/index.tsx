import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'

const RenameButton = () => {
  return (
    <Button className={styles.button} type={'primary'} shape={'round'} icon={<EditOutlined />} iconPosition={'end'}>
      重命名
    </Button>
  )
}

export default RenameButton
