import CoRequest from './request'
import { BASE_URL, TIME_OUT } from './config'
import { message } from '@/utils/AntdGlobal'
// import { localCache } from '@/utils/cache'
import type { Result } from '@/types/main'

// import { showLoading, hideLoading } from '@/components/Loading'
// import { CacheKey } from '@/constants'

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

const coRequest = new CoRequest({
  timeout: TIME_OUT,
  baseURL: BASE_URL,
  interceptors: {
    requestSuccessFn(config) {
      if (config.showLoading) {
        // showLoading()
      }
      // const token = localCache.getCache(CacheKey.TOKEN)
      // if (token) {
      //   config.headers['Authorization'] = token
      // }
      return config
    },
    requestFailFn(err) {
      // hideLoading()
      return Promise.reject(err)
    },
    responseSuccessFn(res: any) {
      // hideLoading()
      // 文件流
      if (res.data instanceof Blob) {
        // const { options } = res.config
        // download(res, options?.downloadFilename)
        return
      }

      const result = res.data as Result.BaseResult
      if (result.code === 200) {
        return result.data
      }

      message.error(result.message).then(null)

      switch (result.code) {
        case 10:
          // localCache.clear()
          location.href = '/login'
          break
      }
      // 处理失败
      return Promise.reject(result)
    },
    responseFailFn(err) {
      // hideLoading()
      return Promise.reject(err)
    }
  }
})

export default coRequest
