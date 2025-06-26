import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '@/lib/store/createAppSlice'
import { FileTypeEnum } from '@/lib/constants/base'
import { getBreadcrumbListApi, getFileListApi } from '@/api/features/file'
import { FileItem } from '@/types/file'

interface IState {
  fileType: string
  breadcrumbList: Record<string, any>[]
  fileList: FileItem[]
  selectFileList: FileItem[]
}

const initialState: IState = {
  fileType: FileTypeEnum.ALL_FILE,
  breadcrumbList: [],
  fileList: [],
  selectFileList: []
} as IState

const fileSlice = createAppSlice({
  name: 'file',
  initialState,
  reducers: ({ reducer, asyncThunk }) => ({
    // 修改文件类型
    setFileTypes: reducer((state, action: PayloadAction<string>) => {
      state.fileType = action.payload
    }),
    // 修改面包屑
    setBreadcrumbList: reducer((state, action: PayloadAction<Record<string, any>>) => {
      const { list } = action.payload
      state.breadcrumbList = list
    }),

    // 修改文件列表
    setFileList: reducer((state, action: PayloadAction<FileItem[]>) => {
      state.fileList = action.payload
    }),

    // 修改已选择的文件
    setSelectFileList: reducer((state, action: PayloadAction<FileItem[]>) => {
      state.selectFileList = action.payload
    }),

    // 获取文件面包屑列表
    getBreadcrumbListAction: asyncThunk(async (fileId: string, { dispatch }) => {
      const result = await getBreadcrumbListApi(fileId)
      dispatch(setBreadcrumbList({ list: result }))
    }),

    // 获取文件列表
    getFileAction: asyncThunk(async (params: Record<string, any>, { dispatch }) => {
      const { parentId, fileTypes } = params
      const result = await getFileListApi(parentId, fileTypes)
      dispatch(setFileList(result))
    })
  })
})

export const {
  setBreadcrumbList,
  setFileList,
  setSelectFileList,
  setFileTypes,
  getBreadcrumbListAction,
  getFileAction
} = fileSlice.actions

export default fileSlice
