import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

type IRequestConfig = InternalAxiosRequestConfig

export interface MyInterceptors<T = AxiosResponse> {
  requestSuccessFn?: (config: IRequestConfig) => IRequestConfig
  requestFailFn?: (err: any) => any
  responseSuccessFn?: (res: T) => T
  responseFailFn?: (err: any) => any
}

export interface MyRequestConfig<T = AxiosResponse> extends IRequestConfig {
  interceptors?: MyInterceptors<T>
}
