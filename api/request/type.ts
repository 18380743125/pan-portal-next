import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export interface MyInterceptors<T = AxiosResponse> {
  requestSuccessFn?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  requestFailFn?: (err: any) => any
  responseSuccessFn?: (res: T) => T
  responseFailFn?: (err: any) => any
}

export interface MyRequestConfig<T = AxiosResponse> extends InternalAxiosRequestConfig {
  interceptors?: MyInterceptors<T>
}
