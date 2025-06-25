interface Config {
  interval: number // 间隔
  leading?: boolean // 首次执行?
  trailing?: boolean // 尾部执行?
}

/**
 * 节流函数
 * @param fn 节流的函数
 * @param config 配置项
 */
export default function throttle(fn: (...arg: any[]) => unknown, config: Config) {
  const { interval, leading = true, trailing = false } = config

  let startTime = 0
  let timer: NodeJS.Timeout | null = null

  const _throttle = function (this: any, ...args: any[]) {
    return new Promise((resolve, reject) => {
      try {
        const nowTime = Date.now()
        // 首次执行控制
        if (!leading && startTime === 0) {
          startTime = nowTime
        }
        const waitTime = interval - (nowTime - startTime)
        if (waitTime <= 0) {
          if (timer) clearTimeout(timer)
          const res = fn.apply(this, args)
          resolve(res)
          startTime = nowTime
          timer = null
          return
        }

        // 尾部执行控制
        if (trailing && !timer) {
          timer = setTimeout(() => {
            const res = fn.apply(this, args)
            resolve(res)
            timer = null
            startTime = Date.now()
          }, waitTime)
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  // 取消尾部执行
  _throttle.cancel = function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return _throttle
}
