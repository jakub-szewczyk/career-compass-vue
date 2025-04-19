import axios, { AxiosError } from 'axios'

export type ApiError = AxiosError<{ error: string }>

export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })
