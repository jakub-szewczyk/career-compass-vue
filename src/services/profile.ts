import { api } from './api'

type GetProfileResponse = {
  id: string
  firstName: string
  lastName: string
  email: string
  isEmailVerified: boolean
}

export const getProfile = () => api<GetProfileResponse>('/profile').then(({ data }) => data)
