import { PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'sonner'

import { createAppSlice } from '@/lib/store/createAppSlice'
import { fileStatus } from '@/lib/utils/file-util'

interface IState {
  taskList: Array<Record<string, any>>
}

const initialState: IState = {
  taskList: []
} as IState

const taskSlice = createAppSlice({
  name: 'task',
  initialState,
  reducers: ({ reducer }) => ({
    // 清空任务
    clearTaskAction: reducer(state => {
      state.taskList = []
    }),

    // 移除任务
    removeTaskAction: reducer((state, action: PayloadAction<string>) => {
      const taskList = state.taskList
      const filename = action.payload
      state.taskList = taskList.filter(task => task.filename !== filename)
    }),

    // 添加上传任务
    addTaskAction: reducer((state, action: PayloadAction<Record<string, any>>) => {
      const params = action.payload
      state.taskList.push(params)
    }),

    // 更新上传任务状态
    updateTaskStatusAction: reducer((state, action: PayloadAction<Record<string, any>>) => {
      const param = action.payload
      const taskList = state.taskList
      const taskItem = taskList.find(taskItem => param.filename === taskItem.filename)
      if (!taskItem) {
        return
      }
      taskItem.status = param.status
      taskItem.statusText = param.statusText
    }),

    // 更新上传任务进度
    updateTaskProcessAction: reducer((state, action: PayloadAction<Record<string, any>>) => {
      const param = action.payload
      const taskList = state.taskList
      const taskItem = taskList.find(taskItem => param.filename === taskItem.filename)
      if (!taskItem) {
        return
      }
      taskItem.speed = param.speed
      taskItem.percentage = param.percentage
      taskItem.uploadedSize = param.uploadedSize
      taskItem.timeRemaining = param.timeRemaining
    }),

    // 暂停上传任务
    pauseTaskAction: reducer((state, action: PayloadAction<string>) => {
      const filename = action.payload
      const taskList = state.taskList
      const taskItem = taskList.find(taskItem => filename === taskItem.filename)
      if (!taskItem) {
        return
      }
      taskItem.target.pause()
      taskItem.status = fileStatus.PAUSE.code
      taskItem.statusText = fileStatus.PAUSE.text
    }),

    // 继续上传任务
    resumeTaskAction: reducer((state, action: PayloadAction<string>) => {
      const filename = action.payload
      const taskList = state.taskList
      const taskItem = taskList.find(taskItem => filename === taskItem.filename)
      if (!taskItem) {
        return
      }
      taskItem.target.resume()
    }),

    // 取消上传任务
    cancelTaskAction: reducer((state, action: PayloadAction<string>) => {
      const filename = action.payload
      const taskList = state.taskList
      for (let i = 0; i < taskList.length; i++) {
        if (filename === taskList[i].filename) {
          taskList[i].target.cancel()
          toast.info('文件：' + filename + ' 已取消上传')
          break
        }
      }
      state.taskList = taskList.filter(task => task.filename !== filename)
    }),

    // 重试上传任务
    retryTaskAction: reducer((state, action: PayloadAction<string>) => {
      const filename = action.payload
      const taskList = state.taskList
      const taskItem = taskList.find(taskItem => filename === taskItem.filename)
      if (!taskItem) {
        return
      }
      taskItem.target.bootstrap()
      taskItem.target.resume()
    })
  })
})

export const {
  clearTaskAction,
  removeTaskAction,
  addTaskAction,
  updateTaskStatusAction,
  updateTaskProcessAction,
  pauseTaskAction,
  resumeTaskAction,
  cancelTaskAction,
  retryTaskAction
} = taskSlice.actions

export default taskSlice
