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

/**
 * 分享文件
 */
export const shareApi = (data: Record<string, any>) => {
  return request.post({
    url: '/share',
    data
  })
}

/**
 * 查询文件夹树
 */
export const getFolderTreeApi = () => {
  return request.get({
    url: '/file/folder/tree'
  })
}

/**
 * 复制文件到
 */
export const copyFileApi = (targetParentId: string, fileIds: string) => {
  return request.post({
    url: '/file/copy',
    data: {
      targetParentId,
      fileIds
    }
  })
}

/**
 * 移动文件到
 */
export const transferFileApi = (targetParentId: string, fileIds: string) => {
  return request.post({
    url: '/file/transfer',
    data: {
      targetParentId,
      fileIds
    }
  })
}

/**
 * 上传文件
 */
export const uploadFileApi = data => {
  return request.post({
    url: '/file',
    data
  })
}

/**
 * 秒传
 */
export const secUploadFileApi = data => {
  return request.post({
    url: '/file/sec-upload',
    data: {
      ...data,
      hideMessageTip: true
    }
  })
}

/**
 * 合并文件
 */
export const mergeFileApi = data => {
  return request.post({
    url: '/file/merge',
    data
  })
}
