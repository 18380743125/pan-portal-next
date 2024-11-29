import { Button } from 'antd'
import { SendOutlined } from '@ant-design/icons'

const TransferButton = () => {
  return (
    <Button type={'default'} shape={'round'} icon={<SendOutlined />} iconPosition={'end'}>
      移动到
    </Button>
  )
}

export default TransferButton
