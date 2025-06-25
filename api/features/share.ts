import request from '@/api/base'

/**
 * 获取分享列表
 */
export const getShareListApi = () => {
  return request.get({
    url: '/shares'
  })
}

/**
 * 取消分享
 */
export const cancelShareApi = (shareIds: string) => {
  return request.delete({
    url: '/share',
    data: {
      shareIds
    }
  })
}
