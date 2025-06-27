import type { AxiosResponse } from 'axios'
import sparkMD5 from 'spark-md5'

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
  dom.remove()
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

export function MD5(_file: any) {
  return new Promise((resolve, reject) => {
    const blobSlice = File.prototype.slice
    const file = _file
    const chunkSize = 1024 * 1024 * 1
    const chunks = Math.ceil(file.size / chunkSize)
    const spark = new sparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    let currentChunk = 0

    fileReader.onload = function (e: any) {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    fileReader.onerror = function () {
      reject('oops, something went wrong.')
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }

    loadNext()
  })
}
