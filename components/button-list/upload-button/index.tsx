import { UploadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRef } from 'react'

import Upload from './upload'

const UploadButton = () => {
  const uploadRef = useRef<{ open: () => {} }>(null)

  const onUpload = () => {
    uploadRef.current?.open()
  }

  return (
    <>
      <Upload ref={uploadRef} />

      <Button type={'primary'} shape={'round'} icon={<UploadOutlined />} iconPosition={'end'} onClick={onUpload}>
        上传
      </Button>
    </>
  )
}

export default UploadButton
