import { api } from './api'

type SignInPayload = {
  email: string
  password: string
}

type SignInResponse = {
  token: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    isEmailVerified: boolean
  }
}

export const signIn = (payload: SignInPayload) =>
  api.post<SignInResponse>('/sign-in', payload).then(({ data }) => data)
