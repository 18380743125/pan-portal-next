function isObject(value: unknown) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

/**
 * 深拷贝
 * @param originValue
 * @param map
 */
export function deepCopy(originValue: any, map = new WeakMap()) {
  // Symbol
  if (typeof originValue === 'symbol') {
    return Symbol(originValue.description)
  }

  // 原始值
  if (!isObject(originValue)) return originValue

  // 处理函数
  if (typeof originValue === 'function') return originValue

  // 检查循环引用
  if (map.has(originValue)) return map.get(originValue)

  // 处理 set
  if (originValue instanceof Set) {
    const newSet = new Set()
    map.set(originValue, newSet)
    originValue.forEach(item => {
      newSet.add(deepCopy(item, map))
    })
    return newSet
  }

  // 处理 map
  if (originValue instanceof Map) {
    const newMap = new Map()
    map.set(originValue, newMap)
    originValue.forEach((value, key) => {
      newMap.set(deepCopy(key, map), deepCopy(value, map))
    })
    return newMap
  }

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
