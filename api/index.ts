import Request from './request'
import { BASE_URL, TIME_OUT } from './config'

import type { Result } from '@/types/base'
import { message } from '@/lib/AntdGlobal'
import { localCache } from '@/lib/utils/cache.util'
import { CacheEnum } from '@/lib/constants'

const request = new Request({
  timeout: TIME_OUT,
  baseURL: BASE_URL,
  interceptors: {
    requestSuccessFn(config) {
      const token = localCache.getCache(CacheEnum.USER_TOKEN)
      if (token) {
        config.headers['Authorization'] = token
      }
      return config
    },
    requestFailFn(err) {
      return Promise.reject(err)
    },
    responseSuccessFn(res: any) {
      const result = res.data as Result.BaseResult
      if (result.code === 0) {
        return result.data
      }

      switch (result.code) {
        case 10: // 未登录
          localCache.clear()
          message.error('请先登陆').then(() => {})
          setTimeout(() => {
            location.href = '/login'
          }, 2000)
          break
        default:
          message.error(result.message).then(() => {})
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
