import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'

const DeleteButton = () => {
  return (
    <Button className={styles.button} type={'primary'} shape={'round'} icon={<DeleteOutlined />} iconPosition={'end'}>
      删除
    </Button>
  )
}

export default DeleteButton
