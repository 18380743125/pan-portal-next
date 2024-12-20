import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import UploadFC from '@/components/button-list/upload-button/upload'
import { useRef } from 'react'

const UploadButton = () => {
  const uploadRef = useRef<{ open: () => {} }>(null)

  const onUpload = () => {
    uploadRef.current?.open()
  }

  return (
    <>
      <UploadFC ref={uploadRef} />

      <Button type={'primary'} shape={'round'} icon={<UploadOutlined />} iconPosition={'end'} onClick={onUpload}>
        上传
      </Button>
    </>
  )
}

export default UploadButton
