import { Button } from 'antd'

import { FolderAddOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'

const CreateFolderButton = () => {
  return (
    <Button
      className={styles.button}
      type={'primary'}
      shape={'round'}
      icon={<FolderAddOutlined />}
      iconPosition={'end'}
    >
      新建文件夹
    </Button>
  )
}

export default CreateFolderButton
