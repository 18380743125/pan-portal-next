'use client'

import { CloudUploadOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { EventTypeEnum, LucasUploader, UploaderOptions } from 'lucas-uploader'
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
  const [uploader, setUploader] = useState<LucasUploader>()

  const uploaderInstanceRef = useRef<Uploader>()
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

  const fileOptions: UploaderOptions = {
    target: config.chunkUploadSwitch ? config.baseUrl + '/file/chunk-upload' : config.baseUrl + '/file/upload',

    singleFile: false,
    chunkSize: getChunkSize(),
    simultaneousUploads: 3,
    fileParameterName: 'file',
    getParams() {
      return {
        parentId: parentIdRef.current
      }
    },
    headers: {
      Authorization: token
    }
  }

  // 插件在调用该方法之前会自动过滤选择的文件 去除正在上传的文件 新添加的文件就是第一个参数files
  const filesAdded = currentTasks => {
    try {
      // 关闭上传弹框并打开下载任务 PopOver
      close()
      setTimeout(() => {
        openTaskList()
      }, 500)

      currentTasks.forEach(async task => {
        task.pause()
        if (task.file.size > config.maxFileSize) {
          throw new Error(`文件：${task.name}大小超过了最大上传文件的限制（${translateFileSize(config.maxFileSize)}）`)
        }

        const taskItem = {
          target: task,
          filename: task.file.name,
          fileSize: translateFileSize(task.file.size),
          uploadedSize: translateFileSize(0),
          status: fileStatus.PARSING.code,
          statusText: fileStatus.PARSING.text,
          timeRemaining: translateTime(Number.POSITIVE_INFINITY),
          speed: translateSpeed(task.progress.speed),
          percentage: 0,
          parentId: parentIdRef.current,
          fileTypes: fileTypesRef.current
        }
        // 添加
        dispatch(addTaskAction(taskItem))

        // 尝试秒传
        const result = await secUploadFileApi({
          filename: task.file.name,
          identifier: task.identifier,
          parentId: parentIdRef.current
        })

        if (result.code === 0) {
          // 秒传成功
          toast.success('文件：' + task.file.name + ' 上传完成')
          task.cancel()
          dispatch(removeTaskAction(task.file.name))
          const taskItem = findTaskItem(task.file.name) || {}
          const { parentId, fileTypes } = taskItem
          if (taskItem.fileTypes === FileTypeEnum.ALL_FILE && taskItem.parentId === parentIdRef.current) {
            // 刷新文件列表
            dispatch(getFileAction({ parentId, fileTypes }))
          }
        } else {
          task.resume()
          dispatch(
            updateTaskStatusAction({
              filename: task.file.name,
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

  const uploadProgress = currentTask => {
    const taskItem = findTaskItem(currentTask.file.name)
    if (!taskItem) {
      return
    }
    if (currentTask.status.code === fileStatus.UPLOADING.code) {
      const progress = currentTask.progress
      dispatch(
        updateTaskProcessAction({
          filename: currentTask.file.name,
          speed: translateSpeed(progress.speed),
          percentage: Math.floor(progress.percentage * 100),
          uploadedSize: translateFileSize(progress.uploadedSize),
          timeRemaining: translateTime(progress.timeRemaining)
        })
      )
    }
    if (taskItem?.status !== currentTask.status.code) {
      dispatch(
        updateTaskStatusAction({
          filename: currentTask.file.name,
          status: currentTask.status.code,
          statusText: currentTask.status.text
        })
      )
    }
  }

  const doMerge = async currentTask => {
    const taskItem = findTaskItem(currentTask.file.name) || {}
    dispatch(
      updateTaskStatusAction({
        filename: currentTask.file.name,
        status: fileStatus.MERGE.code,
        statusText: fileStatus.MERGE.text
      })
    )

    const progress = currentTask.progress
    dispatch(
      updateTaskProcessAction({
        filename: currentTask.file.name,
        speed: translateSpeed(currentTask.file.speed),
        percentage: 99,
        uploadedSize: translateFileSize(progress.uploadedSize),
        timeRemaining: translateTime(progress.timeRemaining)
      })
    )

    try {
      await mergeFileApi({
        filename: taskItem.filename,
        identifier: taskItem.target.identifier,
        parentId: taskItem.parentId,
        totalSize: taskItem.target.file.size
      })
      toast.success('文件：' + currentTask.file.name + ' 上传完成')
      dispatch(
        updateTaskStatusAction({
          filename: currentTask.file.name,
          status: fileStatus.SUCCESS.code,
          statusText: fileStatus.SUCCESS.text
        })
      )
      dispatch(removeTaskAction(currentTask.file.name))
      if (taskItem.fileTypes === FileTypeEnum.ALL_FILE && taskItem.parentId === parentIdRef.current) {
        // 刷新文件列表
        const { parentId, fileTypes } = taskItem
        dispatch(getFileAction({ parentId, fileTypes }))
      }
    } catch (e) {
      currentTask.pause()
      dispatch(
        updateTaskStatusAction({
          filename: currentTask.file.name,
          status: fileStatus.FAIL.code,
          statusText: fileStatus.FAIL.text
        })
      )
    }
  }

  const fileUploaded = (result, currentTask) => {
    if (result.code === 0) {
      if (result.data) {
        if (result.data.mergeFlag) {
          doMerge(currentTask)
        } else if (result.data.uploadedChunks?.length === currentTask.chunks.length) {
          doMerge(currentTask)
        }
      } else {
        // 不分片上传（上传完成）
        toast.success('文件：' + currentTask.file.name + ' 上传完成')

        // 刷新文件列表
        dispatch(
          updateTaskStatusAction({
            filename: currentTask.file.name,
            status: fileStatus.SUCCESS.code,
            statusText: fileStatus.SUCCESS.text
          })
        )
        dispatch(removeTaskAction(currentTask.file.name))
        const taskItem = findTaskItem(currentTask.file.name) || {}
        if (taskItem.fileTypes === FileTypeEnum.ALL_FILE && taskItem.parentId === parentIdRef.current) {
          // 刷新文件列表
          const { parentId, fileTypes } = taskItem
          dispatch(getFileAction({ parentId, fileTypes }))
        }
      }
    } else {
      currentTask.pause()
      dispatch(
        updateTaskStatusAction({
          filename: currentTask.file.name,
          status: fileStatus.FAIL.code,
          statusText: fileStatus.FAIL.text
        })
      )
    }
  }

  const uploadComplete = () => {}

  const uploadError = (err, currentTask) => {
    dispatch(
      updateTaskStatusAction({
        filename: currentTask.file.name,
        status: fileStatus.FAIL.code,
        statusText: fileStatus.FAIL.text
      })
    )

    dispatch(
      updateTaskProcessAction({
        filename: currentTask.file.name,
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
    const uploader = new LucasUploader(fileOptions)
    // 绑定进队列
    uploader.on(EventTypeEnum.ADDED, filesAdded)
    // 绑定进度
    uploader.on(EventTypeEnum.PROGRESS, uploadProgress)
    // 上传成功监听
    uploader.on(EventTypeEnum.SUCCESS, fileUploaded)
    // 上传全部完成调用
    uploader.on(EventTypeEnum.COMPLETE, uploadComplete)
    // 上传出错调用
    uploader.on(EventTypeEnum.ERROR, uploadError)
    // 监听合并
    uploader.on(EventTypeEnum.MERGE, doMerge)

    uploaderInstanceRef.current = uploader

    setUploader(uploader)
  }

  // 绑定DOM
  const bindUploader = () => {
    if (uploader && !assignFlag) {
      uploader.assignBrowse(uploaderRef.current as HTMLElement)
      uploader.assignDrop(uploaderRef.current as HTMLElement)
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
