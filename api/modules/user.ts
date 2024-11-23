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

/**
 * 校验用户名
 */
export const checkUsernameApi = (data: Record<string, any>) => {
  return request.post({
    url: '/user/username/check',
    data
  })
}

/**
 * 校验密保答案
 */
export const checkAnswerApi = (data: Record<string, any>) => {
  return request.post({
    url: '/user/answer/check',
    data
  })
}

/**
 * 重置密码
 */
export const resetPasswordApi = (data: Record<string, any>) => {
  return request.post({
    url: '/user/password/reset',
    data
  })
}

/**
 * 获取用户信息
 */
export const getUserInfoApi = () => {
  return request.get({
    url: '/user/'
  })
}
