import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import useFileHandler from '@/hooks/useFileHandler'
import styles from './styles.module.scss'

const DeleteButton = () => {
  const { onDelete } = useFileHandler()

  return (
    <Button
      className={styles.button}
      type={'primary'}
      shape={'round'}
      icon={<DeleteOutlined />}
      iconPosition={'end'}
      onClick={() => onDelete()}
    >
      删除
    </Button>
  )
}

export default DeleteButton
