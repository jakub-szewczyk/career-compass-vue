<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { Toaster } from './components/ui/sonner'
import { SidebarProvider } from './components/ui/sidebar'
import Sidebar from '@/components/navigation/Sidebar.vue'
import Navbar from '@/components/navigation/Navbar.vue'
import { ROUTES } from './router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

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
</script>

<template>
  <SidebarProvider v-if="isSidebarVisible">
    <Sidebar />
    <main class="w-full p-4 lg:p-6">
      <Navbar />
      <RouterView />
    </main>
  </SidebarProvider>
  <RouterView v-else />
  <Toaster richColors />
  <VueQueryDevtools />
</template>
