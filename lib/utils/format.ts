/**
 * 格式化文件大小
 */
export const translateFileSize = (fileSize: number) => {
  const MB_STR = 'M'
  const GB_STR = 'G'
  const UNIT = 1024
  let fileSizeSuffix = 'K'
  fileSize = fileSize / UNIT
  if (fileSize >= UNIT) {
    fileSize = fileSize / UNIT
    fileSizeSuffix = MB_STR
  }
  if (fileSize >= UNIT) {
    fileSize = fileSize / UNIT
    fileSizeSuffix = GB_STR
  }
  return fileSize.toFixed(2) + fileSizeSuffix
}

/**
 * 上传速度
 */
export const translateSpeed = (byteSpeed: number) => {
  return translateFileSize(byteSpeed) + '/s'
}

/**
 * 格式化上传剩余时间
 */
export const translateTime = (timeRemaining: string | number) => {
  if (!timeRemaining || Number.POSITIVE_INFINITY === timeRemaining) {
    return '--:--:--'
  }
  const timeRemainingInt = parseInt(timeRemaining as string)
  const hNum = Math.floor(timeRemainingInt / 3600)
  const mNum = Math.floor((timeRemainingInt / 60) % 60)
  const sNum = Math.floor(timeRemainingInt % 60)
  const h = hNum < 10 ? '0' + hNum : hNum
  const m = mNum < 10 ? '0' + mNum : mNum
  const s = sNum < 10 ? '0' + sNum : sNum
  return h + ':' + m + ':' + s
}
