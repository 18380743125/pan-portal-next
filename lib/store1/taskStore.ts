import { create } from 'zustand'

interface TaskActionState {}

export const useCacheStore = create<TaskActionState>()(set => ({}))
