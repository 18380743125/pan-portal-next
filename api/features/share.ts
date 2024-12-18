import request from '@/api'

/**
 * 获取分享列表
 */
export const getShareListApi = () => {
  return request.get({
    url: '/shares'
  })
}
