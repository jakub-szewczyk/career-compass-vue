<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useSidebar } from '../ui/sidebar'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/vue-query'
import { getProfile } from '@/services/profile'
import { computed } from 'vue'
import { QUERY_KEYS } from '@/lib/query'
import { Skeleton } from '../ui/skeleton'

const { isMobile, toggleSidebar } = useSidebar()

const { data, isSuccess } = useQuery({
  queryKey: QUERY_KEYS.PROFILE,
  queryFn: getProfile,
})

const initials = computed(() =>
  isSuccess.value ? data.value!.firstName[0] + data.value!.lastName[0] : null,
)
</script>

<template>
  <header class="mb-5.5 flex justify-between">
    <Button
      :class="cn('invisible', isMobile && 'visible')"
      variant="outline"
      size="icon"
      @click="toggleSidebar"
    >
      <Menu />
    </Button>
    <Avatar class="size-10" v-if="isSuccess">
      <AvatarFallback class="bg-slate-200"
        ><span>{{ initials }}</span>
      </AvatarFallback>
    </Avatar>
    <Skeleton class="size-10 rounded-full bg-slate-200" v-else />
  </header>
</template>
