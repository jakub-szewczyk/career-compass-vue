<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { Toaster } from './components/ui/sonner'
import { SidebarProvider } from './components/ui/sidebar'
import Sidebar from '@/components/navigation/Sidebar.vue'
import Navbar from '@/components/navigation/Navbar.vue'
import { ROUTES } from './router'
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { api, type ApiError } from './services/api'
import { useQueryClient } from '@tanstack/vue-query'

const token = useLocalStorage<string | null>('token', null)

const route = useRoute()
const router = useRouter()

const isSidebarVisible = computed(() =>
  (
    [
      ROUTES.DASHBOARD.path,
      ROUTES.RESUMES.path,
      ROUTES.INTERVIEWS.path,
      ROUTES.APPLICATIONS.path,
      ROUTES.SETTINGS.path,
    ] as string[]
  ).includes(route.path),
)

const queryClient = useQueryClient()

watch(
  token,
  () => {
    api.interceptors.request.use((config) => {
      if (token.value) config.headers.Authorization = `Bearer ${token.value}`
      return config
    })

    api.interceptors.response.use(
      (config) => config,
      (error: ApiError) => {
        if (error.status === 401) {
          token.value = null
          queryClient.clear()
          router.push({
            path: ROUTES.SIGN_IN.path,
            query: {
              ...(route.path !== ROUTES.DASHBOARD.path && {
                redirect: route.fullPath,
              }),
            },
          })
        }
        return Promise.reject(error)
      },
    )
  },
  { once: true, immediate: true },
)
</script>

<template>
  <SidebarProvider v-if="isSidebarVisible">
    <Sidebar />
    <main class="w-full overflow-x-auto p-4 lg:p-6">
      <Navbar class="mb-5.5" />
      <RouterView />
    </main>
  </SidebarProvider>
  <RouterView v-else />
  <Toaster richColors />
  <VueQueryDevtools />
</template>
