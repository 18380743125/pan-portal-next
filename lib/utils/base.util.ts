/**
 * value 是否是对象
 * @param value
 */
export function isObject(value: unknown) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}
