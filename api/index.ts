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
