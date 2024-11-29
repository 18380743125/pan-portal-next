import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const UploadButton = () => {
  return (
    <Button type={'primary'} shape={'round'} icon={<UploadOutlined />} iconPosition={'end'}>
      上传
    </Button>
  )
}

export default UploadButton
