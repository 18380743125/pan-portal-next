/**
 * 格式化文件大小
 */
export const translateFileSize = fileSize => {
  const MB_STR = 'M',
    GB_STR = 'G',
    UNIT = 1024
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
export const translateSpeed = byteSpeed => {
  return translateFileSize(byteSpeed) + '/s'
}

/**
 * 格式化上次剩余时间
 */
export const translateTime = timeRemaining => {
  if (!timeRemaining || Number.POSITIVE_INFINITY === timeRemaining) {
    return '--:--:--'
  }
  const timeRemainingInt = parseInt(timeRemaining),
    hNum = Math.floor(timeRemainingInt / 3600),
    mNum = Math.floor((timeRemainingInt / 60) % 60),
    sNum = Math.floor(timeRemainingInt % 60),
    h = hNum < 10 ? '0' + hNum : hNum,
    m = mNum < 10 ? '0' + mNum : mNum,
    s = sNum < 10 ? '0' + sNum : sNum
  return h + ':' + m + ':' + s
}
