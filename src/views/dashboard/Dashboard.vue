<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { QUERY_KEYS } from '@/lib/query'
import { getProfile } from '@/services/profile'
import { useQuery } from '@tanstack/vue-query'
import { useTitle } from '@vueuse/core'

useTitle('CareerCompass - Dashboard')

const { data, isSuccess } = useQuery({
  queryKey: QUERY_KEYS.PROFILE,
  queryFn: getProfile,
})
</script>

<template>
  <h1 class="text-xl font-semibold" v-if="isSuccess">Good afternoon, {{ data?.firstName }} 👋</h1>
  <Skeleton class="h-7 w-[250px] bg-slate-200" v-else />
</template>
