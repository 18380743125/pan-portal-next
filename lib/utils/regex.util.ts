/**
 * 用户名格式验证
 * @param str
 */
export const validateUsername = (str: string) => {
  const reg = /^[A-Za-z0-9]{6,16}$/
  return reg.test(str)
}

/**
 * 密码格式验证
 * @param str
 */
export const validatePassword = (str: string) => {
  // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,16}$/
  const passwordRegex = /^[A-Za-z0-9]{6,16}$/
  return passwordRegex.test(str)
}
