import Request from './request'
import { BASE_URL, TIME_OUT } from './config'
import { message } from '@/lib/AntdGlobal'
import type { Result } from '@/types/main'
import { Blob } from 'node:buffer'

// 下载文件
// const download = (res: AxiosResponse, customName?: string) => {
// const filename = res.headers['content-disposition']?.replace(/\w+;filename=(.*)/, '$1') || customName
// const dom = document.createElement('a')
// const url = window.URL.createObjectURL(res.data)
// dom.href = url
// dom.download = decodeURIComponent(filename)
// dom.style.display = 'none'
// document.body.appendChild(dom)
// dom.click()
// dom.parentNode?.removeChild(dom)
// window.URL.revokeObjectURL(url)
// }

const request = new Request({
  timeout: TIME_OUT,
  baseURL: BASE_URL,
  interceptors: {
    requestSuccessFn(config) {
      return config
    },
    requestFailFn(err) {
      return Promise.reject(err)
    },
    responseSuccessFn(res: any) {
      // 文件流
      if (res.data instanceof Blob) {
        // download(res)
        return
      }

      const result = res.data as Result.BaseResult
      if (result.code === 200) {
        return result.data
      }

      message.error(result.message).then(() => {})

      switch (result.code) {
        case 10: // 未登录
          location.href = '/login'
          break
      }
      // 处理失败
      return Promise.reject(result)
    },
    responseFailFn(err) {
      return Promise.reject(err)
    }
  }
})

export default request
