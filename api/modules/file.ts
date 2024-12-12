import request from '@/api'

/**
 * 获取文件导航面包屑
 */
export const getBreadcrumbListApi = (fileId: string) => {
  return request.get({
    url: '/file/breadcrumbs',
    params: {
      fileId
    }
  })
}

/**
 * 获取文件列表
 */
export const getFileListApi = (parentId: string, fileTypes: string) => {
  return request.get({
    url: 'files',
    params: {
      parentId,
      fileTypes
    }
  })
}
