import request from '@/api'

/**
 * 获取回收站列表
 */
export const getRecycleListApi = () => {
  return request.get({
    url: '/recycles'
  })
}

/**
 * 还原
 */
export const restoreRecycleApi = fileIds => {
  return request.put({
    url: '/recycle/restore',
    data: {
      fileIds
    }
  })
}

/**
 * 删除回收站
 */
export const deleteRecycleApi = (fileIds: string) => {
  return request.delete({
    url: '/recycle',
    data: {
      fileIds
    }
  })
}
