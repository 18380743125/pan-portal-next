import axios, { AxiosRequestHeaders } from 'axios'
import type { AxiosInstance } from 'axios'

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

  request<T = any>(config: MyRequestConfig<T>) {
    // 单次请求拦截处理
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config)
    }
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res: T) => {
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
    return this.request({ ...config, method: 'GET', headers: {} as AxiosRequestHeaders })
  }

  post<T = any>(config: Omit<MyRequestConfig<T>, 'headers'> & { headers?: { 'Content-Type': string } }) {
    return this.request({ ...config, method: 'POST', headers: {} as AxiosRequestHeaders })
  }

  delete<T = any>(config: Omit<MyRequestConfig<T>, 'headers'>) {
    return this.request({ ...config, method: 'DELETE', headers: {} as AxiosRequestHeaders })
  }

  put<T = any>(config: Omit<MyRequestConfig<T>, 'headers'>) {
    return this.request({ ...config, method: 'PUT', headers: {} as AxiosRequestHeaders })
  }

  patch<T = any>(config: Omit<MyRequestConfig<T>, 'headers'>) {
    return this.request({ ...config, method: 'PATCH', headers: {} as AxiosRequestHeaders })
  }
}

export default Request
