import axios, { AxiosError } from 'axios'

export type ApiError = AxiosError<{ error: string }>

export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (!token) return config
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// TODO: Handle expired tokens
