'use client'

import { CloudUploadOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Uploader from 'simple-uploader.js'
import { toast } from 'sonner'

import { mergeFileApi, secUploadFileApi } from '@/api/features/file'
import { openTaskList } from '@/components/task-list'
import { CacheEnum, config, FileTypeEnum } from '@/lib/constants/base'
import { getFileAction } from '@/lib/store/features/fileSlice'
import {
  addTaskAction,
  clearTaskAction,
  removeTaskAction,
  updateTaskProcessAction,
  updateTaskStatusAction
} from '@/lib/store/features/taskSlice'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { MD5 } from '@/lib/utils/base'
import { localCache } from '@/lib/utils/common/cache'
import { fileStatus, getChunkSize } from '@/lib/utils/file-util'
import { translateFileSize, translateSpeed, translateTime } from '@/lib/utils/format'

import styles from './styles.module.scss'

const Upload = forwardRef((_, ref) => {
  // 上传弹框是否显示
  const [visible, setVisible] = useState(false)
  // 上传弹框组件实例
  const uploaderRef = useRef<HTMLElement | null>(null)
  // simple upload 和 dom 是否绑定
  const [assignFlag, setAssignFlag] = useState(false)
  // simple upload 上传实例
  const [uploader, setUploader] = useState<Uploader>()

  const uploaderInstanceRef = useRef<any>()
  const parentIdRef = useRef<string>()
  const fileTypesRef = useRef<string>()
  const taskListRef = useRef<Record<string, any>[]>()

  const dispatch = useAppDispatch()

  const { fileTypes, breadcrumbList, taskList, userInfo } = useAppSelector(
    state => ({
      fileTypes: state.file.fileType,
      breadcrumbList: state.file.breadcrumbList,
      taskList: state.task.taskList,
      userInfo: state.user.userInfo
    }),
    shallowEqualApp
  )

  useEffect(() => {
    // taskList
    taskListRef.current = taskList
  }, [taskList])

  useEffect(() => {
    if (!userInfo) {
      return
    }

    // fileTypes
    fileTypesRef.current = fileTypes

    // parentId
    const lastFile = breadcrumbList[breadcrumbList.length - 1]
    if (fileTypes === FileTypeEnum.ALL_FILE && lastFile) {
      parentIdRef.current = lastFile.id
    } else {
      parentIdRef.current = userInfo.rootFileId
    }
  }, [breadcrumbList, fileTypes])

  const open = () => {
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  const onCancel = () => {
    close()
  }

  const findTaskItem = (name: string) => {
    return taskListRef.current?.find(item => item.filename === name)
  }

  // 详细文档地址：https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md#%E9%85%8D%E7%BD%AE
  const token = localCache.getCache(CacheEnum.USER_TOKEN)

  const fileOptions = {
    target: function (file, chunk) {
      if (config.chunkUploadSwitch) {
        return config.baseUrl + '/file/chunk-upload'
      }
      return config.baseUrl + '/file/upload'
    },
    singleFile: false,
    chunkSize: getChunkSize(),
    testChunks: config.chunkUploadSwitch,
    forceChunkSize: false,
    simultaneousUploads: 3,
    fileParameterName: 'file',
    query: function (file, chunk) {
      return {
        parentId: parentIdRef.current
      }
    },
    headers: {
      Authorization: token
    },
    checkChunkUploadedByResponse: function (chunk, message) {
      let objMessage = {} as any
      try {
        objMessage = JSON.parse(message)
      } catch (e) {}
      if (objMessage.data) {
        return (objMessage.data.uploadedChunks || []).indexOf(chunk.offset + 1) >= 0
      }
      // fake response
      // objMessage.uploaded_chunks = [2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 17, 20, 21]
      // check the chunk is uploaded
      return true
    },
    maxChunkRetries: 0,
    chunkRetryInterval: null,
    progressCallbacksInterval: 500,
    successStatuses: [200, 201, 202],
    permanentErrors: [404, 415, 500, 501],
    initialPaused: false
  }

  // 插件在调用该方法之前会自动过滤选择的文件 去除正在上传的文件 新添加的文件就是第一个参数files
  const filesAdded = (files, fileList, event) => {
    try {
      // 关闭上传弹框并打开下载任务 PopOver
      close()
      setTimeout(() => {
        openTaskList()
      }, 500)

      files.forEach(async target => {
        target.pause()
        if (target.size > config.maxFileSize) {
          throw new Error(
            `文件：${target.name}大小超过了最大上传文件的限制（${translateFileSize(config.maxFileSize)}）`
          )
        }

        const taskItem = {
          target,
          filename: target.name,
          fileSize: translateFileSize(target.size),
          uploadedSize: translateFileSize(0),
          status: fileStatus.PARSING.code,
          statusText: fileStatus.PARSING.text,
          timeRemaining: translateTime(Number.POSITIVE_INFINITY),
          speed: translateSpeed(target.averageSpeed),
          percentage: 0,
          parentId: parentIdRef.current,
          fileTypes: fileTypesRef.current
        }
        // 添加
        dispatch(addTaskAction(taskItem))

        const md5 = await MD5(target.file)
        target['uniqueIdentifier'] = md5

        // 尝试秒传
        const result = await secUploadFileApi({
          filename: target.name,
          identifier: md5,
          parentId: parentIdRef.current
        })

        if (result.code === 0) {
          // 秒传成功
          toast.success('文件：' + target.name + ' 上传完成')
          target.cancel()
          dispatch(removeTaskAction(target.name))
          const taskItem = findTaskItem(target.name) || {}
          const { parentId, fileTypes } = taskItem
          if (taskItem.fileTypes === FileTypeEnum.ALL_FILE && taskItem.parentId === parentIdRef.current) {
            // 刷新文件列表
            dispatch(getFileAction({ parentId, fileTypes }))
          }
        } else {
          target.resume()
          dispatch(
            updateTaskStatusAction({
              filename: target.name,
              status: fileStatus.WAITING.code,
              statusText: fileStatus.WAITING.text
            })
          )
        }
      })
    } catch (e: any) {
      toast.error(e.message)
      uploaderInstanceRef.current.cancel()
      dispatch(clearTaskAction())
    }
    return true
  }

  const uploadProgress = (rootFile, file, chunk) => {
    const taskItem = findTaskItem(file.name)
    if (file.isUploading()) {
      if (taskItem?.status !== fileStatus.UPLOADING.code) {
        dispatch(
          updateTaskStatusAction({
            filename: file.name,
            status: fileStatus.UPLOADING.code,
            statusText: fileStatus.UPLOADING.text
          })
        )
      }
      dispatch(
        updateTaskProcessAction({
          filename: file.name,
          speed: translateSpeed(file.averageSpeed),
          percentage: Math.floor(file.progress() * 100),
          uploadedSize: translateFileSize(file.sizeUploaded()),
          timeRemaining: translateTime(file.timeRemaining())
        })
      )
    }
  }

  const doMerge = async file => {
    const taskItem = findTaskItem(file.name) || {}
    dispatch(
      updateTaskStatusAction({
        filename: file.name,
        status: fileStatus.MERGE.code,
        statusText: fileStatus.MERGE.text
      })
    )

    dispatch(
      updateTaskProcessAction({
        filename: file.name,
        speed: translateSpeed(file.averageSpeed),
        percentage: 99,
        uploadedSize: translateFileSize(file.sizeUploaded()),
        timeRemaining: translateTime(file.timeRemaining())
      })
    )

    try {
      await mergeFileApi({
        filename: taskItem?.filename,
        identifier: taskItem?.target.uniqueIdentifier,
        parentId: taskItem?.parentId,
        totalSize: taskItem?.target.size
      })
      toast.success('文件：' + file.name + ' 上传完成')
      uploaderInstanceRef.current?.removeFile(file)
      dispatch(
        updateTaskStatusAction({
          filename: file.name,
          status: fileStatus.SUCCESS.code,
          statusText: fileStatus.SUCCESS.text
        })
      )
      dispatch(removeTaskAction(file.name))
      if (taskItem.fileTypes === FileTypeEnum.ALL_FILE && taskItem.parentId === parentIdRef.current) {
        // 刷新文件列表
        const { parentId, fileTypes } = taskItem
        dispatch(getFileAction({ parentId, fileTypes }))
      }
    } catch (e) {
      file.pause()
      dispatch(
        updateTaskStatusAction({
          filename: file.name,
          status: fileStatus.FAIL.code,
          statusText: fileStatus.FAIL.text
        })
      )
    }
  }

  const fileUploaded = (rootFile, file, message, chunk) => {
    let res = {} as any
    try {
      res = JSON.parse(message)
    } catch (e) {}
    if (res.code === 0) {
      if (res.data) {
        if (res.data.mergeFlag) {
          doMerge(file)
        } else if (res.data.uploadedChunks?.length === file.chunks.length) {
          doMerge(file)
        }
      } else {
        // 不分片上传（上传完成）
        toast.success('文件：' + file.name + ' 上传完成')
        uploaderInstanceRef.current.removeFile(file)
        // 刷新文件列表
        dispatch(
          updateTaskStatusAction({
            filename: file.name,
            status: fileStatus.SUCCESS.code,
            statusText: fileStatus.SUCCESS.text
          })
        )
        dispatch(removeTaskAction(file.name))
        const taskItem = findTaskItem(file.name) || {}
        if (taskItem.fileTypes === FileTypeEnum.ALL_FILE && taskItem.parentId === parentIdRef.current) {
          // 刷新文件列表
          const { parentId, fileTypes } = taskItem
          dispatch(getFileAction({ parentId, fileTypes }))
        }
      }
    } else {
      file.pause()
      dispatch(
        updateTaskStatusAction({
          filename: file.name,
          status: fileStatus.FAIL.code,
          statusText: fileStatus.FAIL.text
        })
      )
    }
  }

  const uploadComplete = () => {}

  const uploadError = (rootFile, file, message, chunk) => {
    dispatch(
      updateTaskStatusAction({
        filename: file.name,
        status: fileStatus.FAIL.code,
        statusText: fileStatus.FAIL.text
      })
    )

    dispatch(
      updateTaskProcessAction({
        filename: file.name,
        speed: translateSpeed(0),
        percentage: 0,
        uploadedSize: translateFileSize(0),
        timeRemaining: translateTime(Number.POSITIVE_INFINITY)
      })
    )
  }

  // 初始化 uploader
  const initUploader = () => {
    // 实例化一个上传对象
    const uploader = new Uploader(fileOptions)
    // 如果不支持 需要降级的地方
    if (!uploader.support) {
      toast.error('本浏览器不支持simple-uploader，请更换浏览器重试')
    }
    // 绑定进队列
    uploader.on('filesAdded', filesAdded)
    // 绑定进度
    uploader.on('fileProgress', uploadProgress)
    // 上传成功监听
    uploader.on('fileSuccess', fileUploaded)
    // 上传全部完成调用
    uploader.on('complete', uploadComplete)
    // 上传出错调用
    uploader.on('fileError', uploadError)

    uploaderInstanceRef.current = uploader

    setUploader(uploader)
  }

  // 绑定DOM
  const bindUploader = () => {
    if (uploader && !uploader.support) {
      toast.error('本浏览器不支持simple-uploader，请更换浏览器重试')
    }
    if (uploader && !assignFlag) {
      uploader.assignBrowse(uploaderRef.current)
      uploader.assignDrop(uploaderRef.current)
      setAssignFlag(true)
    }
  }

  useEffect(() => {
    initUploader()
  }, [])

  useEffect(() => {
    bindUploader()
  }, [visible])

  return (
    <Modal footer={null} width={640} title='文件上传' open={visible} onCancel={onCancel}>
      <main className={styles.root}>
        <section className={styles.uploadContent} ref={uploaderRef}>
          <section className={styles.topIcon}>
            <CloudUploadOutlined />
          </section>

          <section className={styles.tips}>
            <span>将文件拖到此处，或</span>
            <a>点击上传</a>
          </section>
        </section>
      </main>
    </Modal>
  )
})

Upload.displayName = 'Upload'

export default Upload
