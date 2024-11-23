import { message } from '@/lib/AntdGlobal'
import { validatePassword as checkPassword, validateUsername as checkUsername } from '@/lib/utils/regex.util'

/**
 * 校验用户名和密码格式
 * @param username
 * @param password
 */
export const validateUsernameAndPassword = (username: string, password: string) => {
  return validateUsername(username) && validatePassword(password)
}

export const validateUsername = (username: string) => {
  if (!username || !checkUsername(username)) {
    if (!username) {
      message.warning('请填写用户名').then(() => {})
    } else {
      message.warning('请填写6~16位由数字和字母组成的用户名').then(() => {})
    }
    return false
  }
  return true
}

export const validatePassword = (password: string) => {
  if (!password || !checkPassword(password)) {
    if (!password) {
      message.warning('请填写密码').then(() => {})
    } else {
      message.warning('密码必须包含数字和字母，长度在6至16位之内，可包含以下特殊字符：!@#$%^&*()+-').then(() => {})
    }
    return false
  }
  return true
}
