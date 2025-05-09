import type { Sort, Status } from '@/services/application'
import type { DateValue } from 'reka-ui'
import type { Ref } from 'vue'

export const QUERY_KEYS = {
  PROFILE: ['profile'],
  APPLICATIONS: (params?: {
    companyNameOrJobTitle: Ref<string, string>
    dateApplied: Ref<DateValue | undefined, DateValue | undefined>
    status: Ref<Status | undefined, Status | undefined>
    sort: Ref<Sort | undefined, Sort | undefined>
    page: Ref<number, number>
    size: Ref<number, number>
  }) => ['applications', ...(params ? [params] : [])],
}
