interface Config {
  delay: number
  immediate?: boolean
}

/**
 * 防抖函数
 * @param fn 防抖的函数
 * @param config 配置项
 */
export default function debounce(fn: (...arg: any[]) => unknown, config: Config) {
  const { delay, immediate = false } = config

  let timer: NodeJS.Timeout | null = null
  let isInvoke = false

  const _debounce = function (this: any, ...args: any[]) {
    return new Promise((resolve, reject) => {
      try {
        // 立即执行控制
        if (immediate && !isInvoke) {
          const result = fn.apply(this, args)
          isInvoke = true
          resolve(result)
          return
        }
        if (timer) clearTimeout(timer)

        timer = setTimeout(() => {
          const result = fn.apply(this, args)
          resolve(result)
          timer = null
          isInvoke = false
        }, delay)
      } catch (err) {
        reject(err)
      }
    })
  }

  // 取消
  _debounce.cancel = function () {
    if (timer) clearTimeout(timer)
  }

  return _debounce
}
