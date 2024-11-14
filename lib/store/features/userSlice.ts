import { createAppSlice } from '@/lib/store/createAppSlice'
import { User } from '@/types/user'
import { loginApi } from '@/api/modules/user'

export interface IState {}

const counterSlice = createAppSlice({
  name: 'user',
  initialState: {} as IState,
  reducers: create => ({
    loginAction: create.asyncThunk(async (data: User.LoginParams) => {
      const result = await loginApi(data)
      console.log(result)
      return result
    })
  })
})

export const { loginAction } = counterSlice.actions

export default counterSlice
