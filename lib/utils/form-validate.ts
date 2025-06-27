import { checkPassword, checkUsername } from '@/lib/utils/regex-check'
import { toast } from 'sonner'

/**
 * 校验用户名和密码格式
 * @param username
 * @param password
 */
export const validateUsernameAndPassword = (username: string, password: string) => {
  return validateUsername(username) && validatePassword(password)
}

export const validateUsername = (username: string) => {
  if (!username) {
    toast.warning('请填写用户名')
    return false
  }
  if (!checkUsername(username)) {
    toast.warning('请填写6~16位由数字和字母组成的用户名')
    return false
  }
  return true
}

export const validatePassword = (password: string) => {
  if (!password) {
    toast.warning('请填写密码')
    return false
  }
  if (!checkPassword(password)) {
    toast.warning('密码必须包含数字和字母，长度在6至16位之内，可包含以下特殊字符：!@#$%^&*+-')
    return false
  }
  return true
}
