interface Config {
  interval: number
  leading?: boolean
  trailing?: boolean
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

  const _throttle = function (...args: any[]) {
    return new Promise((resolve, reject) => {
      try {
        const nowTime = Date.now()
        // 立即执行控制
        if (!leading && startTime === 0) {
          startTime = nowTime
        }
        const waitTime = interval - (nowTime - startTime)
        if (waitTime <= 0) {
          if (timer) clearTimeout(timer)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const res = fn.apply(this, args)
          resolve(res)
          startTime = nowTime
          timer = null
          return
        }

        // 尾部执行控制
        if (trailing && !timer) {
          timer = setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
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
