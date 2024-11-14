import { PayloadAction } from '@reduxjs/toolkit'

export type DispatchResult = PayloadAction & { error?: Record<string, any>; meta: Record<string, any> }
