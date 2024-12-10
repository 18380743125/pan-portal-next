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
