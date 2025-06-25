import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFileText, faFileCode } from '@fortawesome/free-regular-svg-icons'
import {
  faFile,
  faFileImage,
  faFileAudio,
  faFileVideo,
  faFileArchive,
  faFileExcel,
  faFileWord,
  faFilePdf,
  faFilePowerpoint
} from '@fortawesome/free-solid-svg-icons'

import { CacheEnum, config } from '@/lib/constants/base'
import { localCache } from '@/lib/utils/common/cache'
import { FileItem } from '@/types/file'

/**
 * 文件上传状态
 */
export const fileStatus = {
  PARSING: {
    code: 1,
    text: '解析中'
  },
  WAITING: {
    code: 2,
    text: '等待上传'
  },
  UPLOADING: {
    code: 3,
    text: '正在上传'
  },
  PAUSE: {
    code: 4,
    text: '暂停上传'
  },
  SUCCESS: {
    code: 5,
    text: '上传成功'
  },
  FAIL: {
    code: 6,
    text: '上传失败'
  },
  MERGE: {
    code: 7,
    text: '服务器处理中'
  }
}

/**
 * 获取文件图标
 */
export const getFileFontElement = (row: FileItem) => {
  const type = row.fileType
  let icon = faFile
  switch (type) {
    case 0:
      icon = faFolder
      break
    case 2:
      icon = faFileArchive
      break
    case 3:
      icon = faFileExcel
      break
    case 4:
      icon = faFileWord
      break
    case 5:
      icon = faFilePdf
      break
    case 6:
      icon = faFileText
      break
    case 7:
      icon = faFileImage
      break
    case 8:
      icon = faFileAudio
      break
    case 9:
      icon = faFileVideo
      break
    case 10:
      icon = faFilePowerpoint
      break
    case 11:
      icon = faFileCode
      break
    default:
      break
  }
  return <FontAwesomeIcon size={'lg'} color={'#919398'} icon={icon} />
}

/**
 * 获取分片大小
 */
export const getChunkSize = () => {
  if (config.chunkUploadSwitch) {
    return 1024 * 1024 * 2
  }
  return config.maxFileSize
}

/**
 * 获取文件预览地址
 */
export const getPreviewUrl = (fileId: string) => {
  const token = localCache.getCache(CacheEnum.USER_TOKEN)
  return `${config.previewUrl}/file/preview?fileId=${encodeURIComponent(fileId)}&authorization=${token}`
}
