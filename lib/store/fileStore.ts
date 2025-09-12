import { create } from 'zustand'

import { getBreadcrumbListApi, getFileListApi } from '@/api/features/file'
import { FileItem } from '@/types/file'
import { FileTypeEnum } from '../constants/base'

interface FileState {
  fileType: string

  breadcrumbList: Record<string, any>[]

  fileList: FileItem[]

  selectFileList: FileItem[]
}

interface FileAction {
  setFileTypes: (type: string) => void

  setBreadcrumbList: (list: Record<string, any>[]) => void

  setFileList: (list: FileItem[]) => void

  setSelectFileList: (list: FileItem[]) => void

  getBreadcrumbListAction: (fileId: string) => void

  getFileAction: (params: Record<string, any>) => void
}

export const useFileStore = create<FileState & FileAction>()((set, get) => ({
  fileType: FileTypeEnum.ALL_FILE,
  breadcrumbList: [],
  fileList: [],
  selectFileList: [],

  // 修改文件类型
  setFileTypes(fileType) {
    set({ fileType })
  },
  // 修改文件路径面包屑
  setBreadcrumbList(breadcrumbList) {
    set({ breadcrumbList })
  },
  setFileList(fileList) {
    set({ fileList })
  },
  // 修改已选择的文件
  setSelectFileList(selectFileList) {
    set({ selectFileList })
  },

  // 获取文件路径面包屑
  async getBreadcrumbListAction(fileId) {
    const { setBreadcrumbList } = get()
    const result = await getBreadcrumbListApi(fileId)
    setBreadcrumbList(result)
  },
  // 获取文件列表
  async getFileAction(params) {
    const { parentId, fileTypes } = params
    const result = await getFileListApi(parentId, fileTypes)
    set({ fileList: result })
  }
}))
