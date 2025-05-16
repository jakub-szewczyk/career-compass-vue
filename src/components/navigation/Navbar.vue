<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
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
import { useRoute } from 'vue-router'
import { ROUTES } from '@/router'

const route = useRoute()

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
  <header class="flex items-center justify-between">
    <Button
      :class="cn('hidden', isMobile && 'flex')"
      variant="outline"
      size="icon"
      @click="toggleSidebar"
    >
      <Menu />
    </Button>
    <div v-if="!isMobile">
      <div v-if="route.path === ROUTES.APPLICATION_DETAILS.path">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <RouterLink :to="ROUTES.APPLICATIONS.path">Job applications</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <RouterLink :to="ROUTES.APPLICATION_DETAILS.path">New application</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
    <Avatar class="size-10" v-if="isSuccess">
      <AvatarFallback class="bg-slate-200"
        ><span>{{ initials }}</span>
      </AvatarFallback>
    </Avatar>
    <Skeleton class="size-10 rounded-full bg-slate-200" v-else />
  </header>
</template>
