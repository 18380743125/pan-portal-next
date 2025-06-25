'use client'

import { deleteFileApi, downloadFileApi } from '@/api/features/file'
import type { FileItem } from '@/types/file'

import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { message, modal } from '@/lib/AntdGlobal'
import { PanEnum } from '@/lib/constants/base'
import { download } from '@/lib/utils/base'
import { getFileAction, setSelectFileList } from '@/lib/store/features/fileSlice'

const useFileHandler = () => {
  const dispatch = useAppDispatch()

  const { fileType, pathList, selectFileList } = useAppSelector(
    state => ({
      fileType: state.file.fileType,
      pathList: state.file.breadcrumbList,
      selectFileList: state.file.selectFileList
    }),
    shallowEqualApp
  )

  // 下载
  const onDownload = async (row?: FileItem) => {
    // 下载单个文件
    if (row) {
      if (row.folderFlag === PanEnum.FOLDER_FLAG) {
        return message.warning('文件夹暂不支持下载')
      }
      const result = await downloadFileApi(row.fileId)
      download(result, row.filename)
    } else {
      // 下载多个文件
      if (!selectFileList.length) {
        return message.warning('请选择要下载的文件')
      }
      for (const item of selectFileList) {
        if (item.folderFlag === PanEnum.FOLDER_FLAG) {
          return message.warning('文件夹暂不支持下载')
        }
      }
      for (const item of selectFileList) {
        const result = await downloadFileApi(item.fileId)
        download(result, item.filename)
      }
    }
  }

  // 删除文件
  const onDelete = async (row?: FileItem) => {
    // 删除单个文件
    let fileIds = row?.fileId || ''
    if (!row) {
      // 删除多个文件
      if (!selectFileList.length) {
        return message.warning('请选择要删除的文件')
      }
      fileIds = selectFileList.map(item => item.fileId).join(PanEnum.COMMON_SEPARATOR)
    }

    modal.confirm({
      title: '提示',
      cancelText: '取消',
      okText: '确定',
      closable: true,
      content: <div style={{ marginBottom: 10 }}>{`文件删除后将保存在回收站，您确定这样做吗？`}</div>,
      async onOk() {
        await deleteFileApi(fileIds)
        message.success('删除成功')
        const current = pathList[pathList.length - 1]

        // 刷新文件列表
        dispatch(getFileAction({ parentId: current.id, fileType }))

        // 取消勾选已删除的文件
        const newSelectFileList = selectFileList.filter(item => !fileIds.includes(item.fileId))
        dispatch(setSelectFileList(newSelectFileList))
      }
    })
  }

  return {
    onDownload,
    onDelete
  }
}

export default useFileHandler
