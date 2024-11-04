import { createAppSlice } from '@/lib/store/createAppSlice'

export interface CounterSliceState {
  value: number
}

const initialState: CounterSliceState = {
  value: 0
}

const counterSlice = createAppSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state, { payload }) {
      state.value += payload
    }
  }
})

export default counterSlice

export const { increment } = counterSlice.actions
