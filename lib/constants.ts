/**
 * 公用配置
 */
export const config = {
  baseUrl: 'https://139.155.139.173:18080/api'
  // baseUrl: 'http://127.0.0.1:8080'
}

/**
 * 缓存key
 */
export enum CacheEnum {
  USER_TOKEN = 'USER_TOKEN',
  USER_INFO = 'USER_INFO'
}

/**
 * 文件类型
 */
export enum FileTypeEnum {
  ALL_FILE = '-1', // 所有文件
  NORMAL_FILE = '1', // 普通文件
  ARCHIVE_FILE = '2', // 压缩文件
  EXCEL_FILE = '3', // excel
  WORD_FILE = '4', // word
  PDF_FILE = '5', // pdf
  TXT_FILE = '6', // 文本
  IMAGE_FILE = '7', // 图片
  AUDIO_FILE = '8', // 音频
  VIDEO_FILE = '9', // 视频
  POWER_POINT_FILE = '10', // ppt
  SOURCE_CODE_FILE = '11', // 源代码
  CSV_FILE = '12' // csv
}
