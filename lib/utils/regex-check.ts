/**
 * 用户名格式校验
 * <br />
 * 由 6~16 位数字和字母组成的用户名
 * @param str
 */
export const checkUsername = (str: string) => {
  const regexp = /^[A-Za-z0-9]{6,16}$/
  return regexp.test(str)
}

/**
 * 密码格式校验
 * <br />
 * 密码必须包含数字和字母，长度在6至16位之内，可包含以下特殊字符：!@#$%^&*()+-
 * @param str
 */
export const checkPassword = (str: string) => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*+-]{6,}$/
  return passwordRegex.test(str)
}
