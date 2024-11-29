'use client'

import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useState } from 'react'

const SearchFC = () => {
  const [keywords, setKeywords] = useState('')

  return (
    <section>
      <Input
        style={{ width: '260px' }}
        placeholder='请输入内容'
        addonAfter={<SearchOutlined style={{ cursor: 'pointer' }} />}
        value={keywords}
        onChange={e => setKeywords(e.target.value)}
        allowClear
      />
    </section>
  )
}

export default SearchFC
