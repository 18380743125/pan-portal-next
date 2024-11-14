import axios from 'axios'
import type { AxiosInstance } from 'axios'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import type { MyRequestConfig } from './type'

class Request {
  instance: AxiosInstance

  constructor(config: Omit<MyRequestConfig, 'headers'>) {
    this.instance = axios.create(config)

    // 全局请求拦截器
    this.instance.interceptors.request.use(
      config => {
        NProgress.start()
        return config
      },
      err => {
        NProgress.done()
        return Promise.reject(err)
      }
    )

    // 全局响应拦截器
    this.instance.interceptors.response.use(
      res => {
        NProgress.done()
        return res
      },
      err => {
        NProgress.done()
        return Promise.reject(err)
      }
    )

    // 实例拦截器
    this.instance.interceptors.request.use(config.interceptors?.requestSuccessFn, config.interceptors?.requestFailFn)
    this.instance.interceptors.response.use(config.interceptors?.responseSuccessFn, config.interceptors?.responseFailFn)
  }

  request<T = any>(config: Omit<MyRequestConfig<T>, 'headers'>) {
    // 单次请求拦截处理
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config)
    }
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res: T | undefined) => {
          // 单次响应成功的拦截器
          if (config.interceptors?.responseSuccessFn) {
            res = config.interceptors?.responseSuccessFn(res)
          }
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }

  get<T = any>(config: Omit<MyRequestConfig<T>, 'headers'>) {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = any>(config: Omit<MyRequestConfig<T>, 'headers'> & { headers?: { 'Content-Type': string } }) {
    return this.request({ ...config, method: 'POST' })
  }

  delete<T = any>(config: Omit<MyRequestConfig<T>, 'headers'>) {
    return this.request({ ...config, method: 'DELETE' })
  }

  put<T = any>(config: Omit<MyRequestConfig<T>, 'headers'>) {
    return this.request({ ...config, method: 'PUT' })
  }

  patch<T = any>(config: Omit<MyRequestConfig<T>, 'headers'>) {
    return this.request({ ...config, method: 'PATCH' })
  }
}

export default Request
