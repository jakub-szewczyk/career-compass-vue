import type { PaginatedResponse } from '@/types/common'
import { api } from './api'

type Status = 'IN_PROGRESS' | 'REJECTED' | 'ACCEPTED'

type GetApplicationsPayload = Partial<{
  page: number
  size: number
  sort:
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
  company_name_or_job_title: string
  date_applied: string
  status: Status
}>

type GetApplicationsResponse = PaginatedResponse<{
  id: string
  companyName: string
  jobTitle: string
  dateApplied: string
  status: Status
  isReplied: boolean
  minSalary?: number
  maxSalary?: number
  jobPostingURL?: string
  notes?: string
}>

export const getApplications = (params?: GetApplicationsPayload) =>
  api<GetApplicationsResponse>('/job-applications', { params }).then(({ data }) => data)
