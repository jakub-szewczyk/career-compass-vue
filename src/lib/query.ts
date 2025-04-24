import type { Ref } from 'vue'

export const QUERY_KEYS = {
  PROFILE: ['profile'],
  APPLICATIONS: (params: { page: Ref<number>; size: Ref<number> }) => ['applications', params],
}
