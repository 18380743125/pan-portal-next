import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '@/lib/store/createAppSlice'
import { FileTypeEnum } from '@/lib/constants'
import { getBreadcrumbListApi, getFileListApi } from '@/api/modules/file'

interface IState {
  fileTypes: string
  breadcrumbList: Record<string, any>[]
  fileList: Record<string, any>[]
}

const initialState: IState = {
  fileTypes: FileTypeEnum.ALL_FILE,
  breadcrumbList: [],
  fileList: []
} as IState

const fileSlice = createAppSlice({
  name: 'file',
  initialState,
  reducers: create => ({
    // 修改面包屑
    setBreadcrumbList: create.reducer((state, action: PayloadAction<Record<string, any>[]>) => {
      state.breadcrumbList = action.payload
    }),

    // 修改文件列表
    setFileList: create.reducer((state, action: PayloadAction<Record<string, any>[]>) => {
      state.fileList = action.payload
    }),

    // 获取文件面包屑列表
    getBreadcrumbListAction: create.asyncThunk(async (fileId: string, { dispatch }) => {
      const result = await getBreadcrumbListApi(fileId)
      dispatch(setBreadcrumbList(result))
    }),

    // 获取文件列表
    getFileAction: create.asyncThunk(async (params: Record<string, any>, { dispatch }) => {
      const { parentId, fileTypes } = params
      const result = await getFileListApi(parentId, fileTypes)
      dispatch(setFileList(result))
    })
  })
})

export const { setBreadcrumbList, setFileList, getBreadcrumbListAction, getFileAction } = fileSlice.actions

export default fileSlice
