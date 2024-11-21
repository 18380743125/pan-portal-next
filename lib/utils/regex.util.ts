/**
 * 用户名格式校验
 * @param str
 */
export const validateUsername = (str: string) => {
  const regexp = /^[A-Za-z0-9]{6,16}$/
  return regexp.test(str)
}

/**
 * 密码格式校验
 * @param str
 */
export const validatePassword = (str: string) => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*()+-]{6,}$/
  return passwordRegex.test(str)
}
