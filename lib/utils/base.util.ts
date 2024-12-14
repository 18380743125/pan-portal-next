import type { AxiosResponse } from 'axios'

/**
 * value 是否是对象
 * @param value
 */
export function isObject(value: unknown) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

/**
 * 下载文件
 */
export function download(res: AxiosResponse, _filename?: string) {
  const data = res.data instanceof Blob ? res.data : new Blob([res.data])
  const filename = res.headers['content-disposition']?.replace(/\w+;filename=(.*)/, '$1') || _filename
  const dom = document.createElement('a')
  const url = window.URL.createObjectURL(data)
  dom.href = url
  dom.download = decodeURIComponent(filename)
  dom.style.display = 'none'
  document.body.appendChild(dom)
  dom.click()
  dom.parentNode?.removeChild(dom)
  window.URL.revokeObjectURL(url)
}

/**
 * 复制文本到剪切板
 */
export function copyText2Clipboard(text: string) {
  navigator?.clipboard?.writeText(text).catch(() => {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  })
}
