import request from '@/api'

/**
 * 获取回收站列表
 */
export const getRecycleListApi = () => {
  return request.get({
    url: '/recycles'
  })
}
