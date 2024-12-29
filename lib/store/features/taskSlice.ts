import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '@/lib/store/createAppSlice'
import { fileStatus } from '@/lib/utils/status.util'
import { message } from '@/lib/AntdGlobal'

interface IState {
  taskList: Array<Record<string, any>>
}

const initialState: IState = {
  taskList: []
} as IState

const taskSlice = createAppSlice({
  name: 'task',
  initialState,
  reducers: create => ({
    // 清空任务
    clearTaskAction: create.reducer(state => {
      state.taskList = []
    }),

    // 移除任务
    removeTaskAction: create.reducer((state, action: PayloadAction<string>) => {
      const taskList = state.taskList
      const filename = action.payload
      state.taskList = taskList.filter(task => task.filename !== filename)
    }),

    // 添加上传任务
    addTaskAction: create.reducer((state, action: PayloadAction<Record<string, any>>) => {
      state.taskList.push(action.payload)
    }),

    // 更新上传任务状态
    updateTaskStatusAction: create.reducer((state, action: PayloadAction<Record<string, any>>) => {
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
    updateTaskProcessAction: create.reducer((state, action: PayloadAction<Record<string, any>>) => {
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
    pauseTaskAction: create.reducer((state, action: PayloadAction<string>) => {
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
    resumeTaskAction: create.reducer((state, action: PayloadAction<string>) => {
      const filename = action.payload
      const taskList = state.taskList
      const taskItem = taskList.find(taskItem => filename === taskItem.filename)
      if (!taskItem) {
        return
      }
      taskItem.target.resume()
    }),

    // 取消上传任务
    cancelTaskAction: create.reducer((state, action: PayloadAction<string>) => {
      const filename = action.payload
      const taskList = state.taskList
      for (let i = 0; i < taskList.length; i++) {
        if (filename === taskList[i].filename) {
          taskList[i].target.cancel()
          message.info('文件：' + filename + ' 已取消上传')
          break
        }
      }
      state.taskList = taskList.filter(task => task.filename !== filename)
    }),

    // 重试上传任务
    retryTaskAction: create.reducer((state, action: PayloadAction<string>) => {
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
