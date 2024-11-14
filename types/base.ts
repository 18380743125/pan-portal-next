/**
 * 分页参数
 */
export interface PageParams {
  currentPage: number
  pageSize: number
}

/**
 * 创建人和更新人
 */
export interface CreateUpdate {
  createTime: string
  updateTime: string
  createBy: string
  updateBy: string
}

/**
 * 开始和结束时间
 */
export interface StartEndTime {
  startTime: Date
  endTime: Date
}

/**
 * 响应类型
 */
export namespace Result {
  // 响应实体
  export interface BaseResult<T = any> {
    code: number
    message?: string
    success?: boolean
    data?: T
  }

  // 带分页响应实体
  export interface PageResult<T = any> {
    currentPage: number
    totalPages: number
    pageSize: number
    totalCount: number
    data: T[]
  }
}
