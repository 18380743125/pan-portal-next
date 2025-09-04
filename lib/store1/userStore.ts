import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface TaskActionState {}

export const useCacheStore = create<TaskActionState>()(
  persist(set => ({}), {
    name: 'user-store',
    storage: createJSONStorage(() => localStorage)
  })
)
