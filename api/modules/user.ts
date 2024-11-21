import request from '@/api'
import { User } from '@/types/user'

/**
 * 用户登录
 */
export const loginApi = (data: User.LoginParams) => {
  return request.post({
    url: '/user/login',
    data
  })
}

/**
 * 用户注册
 */
export const registerApi = (data: Record<string, any>) => {
  return request.post({
    url: '/user/register',
    data
  })
}
