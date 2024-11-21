import { isObject } from './base.util'

/**
 * 深拷贝
 * @param originValue
 * @param map
 */
export function deepCopy(originValue: any, map = new WeakMap()) {
  // 处理 Symbol
  if (typeof originValue === 'symbol') {
    return Symbol(originValue.description)
  }

  // 原始值
  if (!isObject(originValue)) return originValue
  // 处理函数
  if (typeof originValue === 'function') return originValue

  // 处理 set
  if (originValue instanceof Set) {
    const newSet = new Set()
    for (const item of originValue) {
      newSet.add(deepCopy(item, map))
    }
    return newSet
  }

  // 处理 map
  if (originValue instanceof Map) {
    const newMap = new Map()
    for (const item of originValue.entries()) {
      newMap.set(item[0], deepCopy(item[1], map))
    }
    return newMap
  }

  if (map.get(originValue)) return map.get(originValue)

  const newObj = Array.isArray(originValue) ? [] : {}
  map.set(originValue, newObj)

  for (const key in originValue) {
    newObj[key] = deepCopy(originValue[key], map)
  }
  for (const symbolKey of Object.getOwnPropertySymbols(originValue)) {
    newObj[Symbol(symbolKey.description)] = deepCopy(originValue[symbolKey], map)
  }
  return newObj
}
