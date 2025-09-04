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
export function download(res: any, _filename?: string) {
  const data = res.data instanceof Blob ? res.data : new Blob([res.data.buffer || res.data])
  const contentDisposition = res.headers['content-disposition']
  let filename = _filename
  if (contentDisposition) {
    const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    if (matches?.[1]) {
      filename = matches[1].replace(/['"]/g, '')
      if (filename?.startsWith("UTF-8''")) {
        filename = decodeURIComponent(filename.substring(8))
      }
    }
  }
  const dom = document.createElement('a')
  const url = window.URL.createObjectURL(data)
  dom.href = url
  dom.download = decodeURIComponent(filename!)
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

/**
 * 计算文件的 MD5 哈希值
 * @param _file
 * @param chunkSize
 * @param onProgress
 */
export function MD5(
  _file: File,
  chunkSize: number = 512 * 1024,
  onProgress?: (progress: { currentChunk: number; chunks: number }) => void
) {
  return new Promise<string>((resolve, reject) => {
    const blobSlice = Blob.prototype.slice
    const file = _file
    const chunks = Math.ceil(file.size / chunkSize)
    const spark = new sparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    let currentChunk = 0

    fileReader.onload = function (e: any) {
      spark.append(e.target.result)
      currentChunk++
      if (onProgress) {
        onProgress({ currentChunk, chunks })
      }
      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    fileReader.onerror = function () {
      reject(new Error(`FileReader error: ${fileReader.error?.message || null}`))
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }

    loadNext()
  })
}
