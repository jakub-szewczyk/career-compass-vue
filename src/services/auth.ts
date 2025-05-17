import { api } from './api'

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  isEmailVerified: boolean
}

type SignInPayload = {
  email: string
  password: string
}

type SignInResponse = {
  token: string
  user: User
}

export const signIn = (payload: SignInPayload) =>
  api.post<SignInResponse>('/sign-in', payload).then(({ data }) => data)

type SignUpPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

type SignUpResponse = {
  token: string
  user: User
}

export const signUp = (payload: SignUpPayload) =>
  api.post<SignUpResponse>('/sign-up', payload).then(({ data }) => data)
