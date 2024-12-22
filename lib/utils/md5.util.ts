import sparkMD5 from 'spark-md5'

export function MD5(_file, callback) {
  const blobSlice = File.prototype.slice,
    file = _file,
    chunkSize = 1024 * 1024 * 2,
    chunks = Math.ceil(file.size / chunkSize),
    spark = new sparkMD5.ArrayBuffer(),
    fileReader = new FileReader()
  let currentChunk = 0

  fileReader.onload = function (e: any) {
    spark.append(e.target.result)
    currentChunk++
    if (currentChunk < chunks) {
      loadNext()
    } else {
      callback(null, spark.end())
    }
  }

  fileReader.onerror = function () {
    callback('oops, something went wrong.')
  }

  function loadNext() {
    const start = currentChunk * chunkSize,
      end = start + chunkSize >= file.size ? file.size : start + chunkSize
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
  }

  loadNext()
}
