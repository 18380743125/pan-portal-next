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

/**
 * 创建文件夹
 */
export const createFolderApi = (parentId: string, folderName: string) => {
  return request.post({
    url: '/file/folder',
    data: {
      parentId,
      folderName
    }
  })
}

/**
 * 下载文件
 */
export const downloadFileApi = (fileId: string) => {
  return request.get({
    url: '/file/download',
    params: {
      fileId
    }
  })
}

/**
 * 删除文件
 */
export const deleteFileApi = (fileIds: string) => {
  return request.delete({
    url: '/file',
    data: {
      fileIds
    }
  })
}

/**
 * 重命名文件
 */
export const renameApi = (fileId: string, newFilename: string) => {
  return request.put({
    url: '/file',
    data: {
      fileId,
      newFilename
    }
  })
}
