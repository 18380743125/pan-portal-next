import { createAppSlice } from '@/lib/store/createAppSlice'
import { createAsyncThunk } from '@reduxjs/toolkit'

import { User } from '@/types/user'
import { loginApi } from '@/api/modules/user'

export interface IState {}

export const loginAction = createAsyncThunk<any, User.LoginParams>('user/login', async data => {
  const result = loginApi(data)
  console.log(result)
  return result
})

const counterSlice = createAppSlice({
  name: 'user',
  initialState: {} as IState,
  reducers: {}
})

export default counterSlice
