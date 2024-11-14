import request from '@/api'
import { User } from '@/types/user'

/**
 * 登录
 */
export const loginApi = (data: User.LoginParams) => {
  return request.post({
    url: '/user/login',
    data
  })
}
