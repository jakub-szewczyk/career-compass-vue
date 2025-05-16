import type { PaginatedResponse } from '@/types/common'
import { api } from './api'

export enum Status {
  InProgress = 'IN_PROGRESS',
  Rejected = 'REJECTED',
  Accepted = 'ACCEPTED',
}

export type Sort =
  | 'company_name'
  | '-company_name'
  | 'job_title'
  | '-job_title'
  | 'date_applied'
  | '-date_applied'
  | 'status'
  | '-status'
  | 'salary'
  | '-salary'
  | 'is_replied'
  | '-is_replied'

type GetApplicationsPayload = Partial<{
  page: number
  size: number
  sort: Sort
  company_name_or_job_title: string
  date_applied: string
  status: `${Status}`
}>

type GetApplicationsResponse = PaginatedResponse<{
  id: string
  companyName: string
  jobTitle: string
  dateApplied: string
  status: `${Status}`
  isReplied: boolean
  minSalary?: number
  maxSalary?: number
  jobPostingURL?: string
  notes?: string
}>

export const getApplications = (params?: GetApplicationsPayload) =>
  api<GetApplicationsResponse>('/job-applications', { params }).then(({ data }) => data)

type CreateApplicationPayload = {}

type CreateApplicationResponse = {}

export const createApplication = (payload: CreateApplicationPayload) =>
  api.post<CreateApplicationResponse>('/job-applications', payload).then(({ data }) => data)

type DeleteApplicationResponse = {
  id: string
  companyName: string
  jobTitle: string
  dateApplied: string
  status: `${Status}`
  isReplied: boolean
  minSalary?: number
  maxSalary?: number
  jobPostingURL?: string
  notes?: string
}

export const deleteApplication = (applicationId: string) =>
  api
    .delete<DeleteApplicationResponse>(`/job-applications/${applicationId}`)
    .then(({ data }) => data)
