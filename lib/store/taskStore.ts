import { toast } from 'sonner'
import { create } from 'zustand'

import { fileStatus } from '../utils/file-util'

interface TaskState {
  taskList: Record<string, any>[]
}

interface TaskAction {
  addTaskAction: (task: Record<string, any>) => void

  updateTaskStatusAction: (payload: Record<string, any>) => void

  updateTaskProcessAction: (payload: Record<string, any>) => void

  pauseTaskAction: (filename: string) => void

  resumeTaskAction: (filename: string) => void

  cancelTaskAction: (filename: string) => void

  removeTaskAction: (filename: string) => void

  retryTaskAction: (filename: string) => void

  clearTaskAction: () => void
}

export const useTaskStore = create<TaskState & TaskAction>()((set, get) => ({
  taskList: [],

  // 添加任务
  addTaskAction(task) {
    set(state => ({
      ...state,
      taskList: [...state.taskList, task]
    }))
  },
  // 更新任务状态
  updateTaskStatusAction(payload) {
    set(state => ({
      ...state,
      taskList: state.taskList.map(task =>
        task.filename === payload.filename ? { ...task, status: payload.status, statusText: payload.statusText } : task
      )
    }))
  },
  // 更新任务进度
  updateTaskProcessAction(payload) {
    set(state => ({
      ...state,
      taskList: state.taskList.map(task =>
        task.filename === payload.filename
          ? {
              ...task,
              speed: payload.speed,
              percentage: payload.percentage,
              uploadedSize: payload.uploadedSize,
              timeRemaining: payload.timeRemaining
            }
          : task
      )
    }))
  },
  // 暂停任务
  pauseTaskAction(filename) {
    set(state => ({
      ...state,
      taskList: state.taskList.map(task => {
        if (task.filename === filename) {
          task.status = fileStatus.PAUSE.code
          task.statusText = fileStatus.PAUSE.text
          task.target.pause()
        }
        return task
      })
    }))
  },
  // 继续任务
  resumeTaskAction(filename) {
    const { taskList } = get()
    const task = taskList.find(item => item.filename === filename)
    if (task) {
      task.target.resume()
    } else {
      toast.warning('任务不存在')
    }
  },
  // 取消任务
  cancelTaskAction(filename) {
    const { taskList, removeTaskAction } = get()
    const task = taskList.find(item => item.filename === filename)
    if (task) {
      task.target.abort()
      removeTaskAction(filename)
      toast.info('文件：' + filename + ' 已取消上传')
    } else {
      toast.warning('任务不存在')
    }
  },
  // 移除任务
  removeTaskAction(filename) {
    set(state => ({
      ...state,
      taskList: state.taskList.filter(task => task.filename !== filename)
    }))
  },
  // 重试任务
  retryTaskAction(filename) {
    const { taskList } = get()
    const task = taskList.find(item => item.filename === filename)
    if (task) {
      task.target.retry()
    } else {
      toast.warning('任务不存在')
    }
  },
  // 清空任务
  clearTaskAction() {
    set(state => ({
      ...state,
      taskList: []
    }))
  }
}))
