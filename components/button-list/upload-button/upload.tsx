'use client'

import { CloudUploadOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Uploader from 'simple-uploader.js'

import { mergeFileApi, secUploadFileApi } from '@/api/features/file'
import { closeTaskList, openTaskList } from '@/components/task-list'
import { message } from '@/lib/AntdGlobal'
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
import { getChunkSize } from '@/lib/utils/file-util'
import { translateFileSize, translateSpeed, translateTime } from '@/lib/utils/format'
import { fileStatus } from '@/lib/utils/file-util'

import styles from './styles.module.scss'

const UploadFC = forwardRef((_, ref) => {
  // 上传弹框组件实例
  const uploaderRef = useRef<HTMLElement | null>(null)
  // 上传弹框是否显示
  const [visible, setVisible] = useState(false)
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filesAdded = (files, fileList, event) => {
    // 插件在调用该方法之前会自动过滤选择的文件 去除正在上传的文件 新添加的文件就是第一个参数files
    try {
      // 关闭弹框并打开下载任务PopOver
      close()
      setTimeout(() => {
        openTaskList()
      }, 500)

      files.forEach(file => {
        file.pause()
        if (file.size > config.maxFileSize) {
          throw new Error(`文件：${file.name}大小超过了最大上传文件的限制（${translateFileSize(config.maxFileSize)}）`)
        }
        const taskItem = {
          target: file,
          filename: file.name,
          fileSize: translateFileSize(file.size),
          uploadedSize: translateFileSize(0),
          status: fileStatus.PARSING.code,
          statusText: fileStatus.PARSING.text,
          timeRemaining: translateTime(Number.POSITIVE_INFINITY),
          speed: translateSpeed(file.averageSpeed),
          percentage: 0,
          parentId: parentIdRef.current,
          fileTypes: fileTypesRef.current
        }
        // 添加
        dispatch(addTaskAction(taskItem))
        MD5(file.file, async (e, md5) => {
          file['uniqueIdentifier'] = md5
          try {
            const result = await secUploadFileApi({
              filename: file.name,
              identifier: md5,
              parentId: parentIdRef.current
            })
            if (result.code === 0) {
              // 秒传成功
              message.success('文件：' + file.name + ' 上传完成')
              file.cancel()
              dispatch(removeTaskAction(file.name))
              const taskItem = findTaskItem(file.name) || {}
              const { parentId, fileTypes } = taskItem
              if (taskItem.fileTypes === FileTypeEnum.ALL_FILE && taskItem.parentId === parentIdRef.current) {
                // 刷新文件列表
                dispatch(getFileAction({ parentId, fileTypes }))
              }
            } else {
              file.resume()
              dispatch(
                updateTaskStatusAction({
                  filename: file.name,
                  status: fileStatus.WAITING.code,
                  statusText: fileStatus.WAITING.text
                })
              )
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (res) {
            file.resume()
            dispatch(
              updateTaskStatusAction({
                filename: file.name,
                status: fileStatus.WAITING.code,
                statusText: fileStatus.WAITING.text
              })
            )
          }
        })
      })
    } catch (e: any) {
      message.error(e.message)
      uploaderInstanceRef.current.cancel()
      dispatch(clearTaskAction())
      return false
    }
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await mergeFileApi({
        filename: taskItem?.filename,
        identifier: taskItem?.target.uniqueIdentifier,
        parentId: taskItem?.parentId,
        totalSize: taskItem?.target.size
      })
      message.success('文件：' + file.name + ' 上传完成')
      uploaderInstanceRef.current?.removeFile(file)
      if (uploaderInstanceRef.current.files?.length === 0) {
        closeTaskList()
      }
      dispatch(
        updateTaskStatusAction({
          filename: file.name,
          status: fileStatus.SUCCESS.code,
          statusText: fileStatus.SUCCESS.text
        })
      )
      dispatch(removeTaskAction(file.name))
      if (taskItem.parentId === parentIdRef.current && taskItem.fileTypes === FileTypeEnum.ALL_FILE) {
        // 刷新文件列表
        const { parentId, fileTypes } = taskItem
        dispatch(getFileAction({ parentId, fileTypes }))
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fileUploaded = (rootFile, file, message, chunk) => {
    let res = {} as any
    try {
      res = JSON.parse(message)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {}
    if (res.code === 0) {
      if (res.data) {
        if (res.data.mergeFlag) {
          doMerge(file)
        } else if (res.data.uploadedChunks && res.data.uploadedChunks.length === file.chunks.length) {
          doMerge(file)
        }
      } else {
        message.success('文件：' + file.name + ' 上传完成')
        uploaderInstanceRef.current.removeFile(file)
        if (uploaderInstanceRef.current.files?.length === 0) {
          closeTaskList()
        }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      message.error('本浏览器不支持simple-uploader，请更换浏览器重试')
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
      message.error('本浏览器不支持simple-uploader，请更换浏览器重试')
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

UploadFC.displayName = 'UploadFC'

export default UploadFC
