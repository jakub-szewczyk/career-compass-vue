<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { ROUTES } from '@/router'
import {
  Briefcase,
  Calendar,
  Compass,
  Home,
  LogOut,
  PanelLeftClose,
  Settings2,
  PenTool,
} from 'lucide-vue-next'
import { Button } from '../ui/button'
import { useRoute, useRouter, type RouteRecordNameGeneric } from 'vue-router'
import { cn } from '@/lib/utils'
import { useLocalStorage } from '@vueuse/core'
import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

const token = useLocalStorage<string | null>('token', null)

const route = useRoute()
const router = useRouter()

const { openMobile, setOpenMobile, toggleSidebar } = useSidebar()

router.afterEach((to, from) => openMobile && to.path !== from.path && setOpenMobile(false))

const queryClient = useQueryClient()

const handleSignOut = () => {
  token.value = null
  queryClient.clear()
  router.push(ROUTES.SIGN_IN.path)
}

const isDashboardRouteActive = computed(() =>
  ([ROUTES.DASHBOARD.name] as RouteRecordNameGeneric[]).includes(route.name),
)
const isResumesRouteActive = computed(() =>
  ([ROUTES.RESUMES.name, ROUTES.RESUME_EDITOR.name] as RouteRecordNameGeneric[]).includes(
    route.name,
  ),
)
const isInterviewsRouteActive = computed(() =>
  ([ROUTES.INTERVIEWS.name] as RouteRecordNameGeneric[]).includes(route.name),
)
const isApplicationsRouteActive = computed(() =>
  (
    [
      ROUTES.APPLICATIONS.name,
      ROUTES.CREATE_APPLICATION.name,
      ROUTES.UPDATE_APPLICATION.name,
    ] as RouteRecordNameGeneric[]
  ).includes(route.name),
)
const isSettingsRouteActive = computed(() =>
  ([ROUTES.SETTINGS.name] as RouteRecordNameGeneric[]).includes(route.name),
)
</script>

<template>
  <Sidebar collapsible="icon">
    <div class="mt-1.5 mb-3.5 lg:mt-3.5">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                class="pointer-events-none hover:bg-transparent active:bg-transparent"
                asChild
              >
                <div>
                  <Compass class="!size-5" />
                  <span class="text-lg font-semibold">CareerCompass</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton :isActive="isDashboardRouteActive" asChild>
                <RouterLink
                  :class="cn(!isDashboardRouteActive && '!text-slate-500')"
                  :to="ROUTES.DASHBOARD.path"
                >
                  <Home class="!size-5" />
                  <span>Home</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel class="text-[10px] font-semibold text-slate-500 uppercase"
          >Job search</SidebarGroupLabel
        >
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton :isActive="isResumesRouteActive" asChild>
                <RouterLink
                  :class="cn(!isResumesRouteActive && '!text-slate-500')"
                  :to="ROUTES.RESUMES.path"
                >
                  <PenTool class="!size-5" />
                  <span>Resumes</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton :isActive="isInterviewsRouteActive" asChild>
                <RouterLink
                  :class="cn(!isInterviewsRouteActive && '!text-slate-500')"
                  :to="ROUTES.INTERVIEWS.path"
                >
                  <Calendar class="!size-5" />
                  <span>Interviews</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton :isActive="isApplicationsRouteActive" asChild>
                <RouterLink
                  :class="cn(!isApplicationsRouteActive && '!text-slate-500')"
                  :to="ROUTES.APPLICATIONS.path"
                >
                  <Briefcase class="!size-5" />
                  <span>Applications</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel class="text-[10px] font-semibold text-slate-500 uppercase"
          >Account</SidebarGroupLabel
        >
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton :isActive="isSettingsRouteActive" asChild>
                <RouterLink
                  :class="cn(!isSettingsRouteActive && '!text-slate-500')"
                  :to="ROUTES.SETTINGS.path"
                >
                  <Settings2 class="!size-5" />
                  <span>Settings</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  class="cursor-pointer justify-start !pl-2 text-slate-500 hover:text-slate-500 active:text-slate-500"
                  variant="ghost"
                  @click="handleSignOut"
                >
                  <LogOut class="!size-5" />
                  <span>Sign out</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup class="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  class="cursor-pointer justify-start !pl-2 text-slate-500 hover:text-slate-500 active:text-slate-500"
                  variant="ghost"
                  @click="toggleSidebar"
                >
                  <PanelLeftClose class="!size-5" />
                  <span>Collapse</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter />
  </Sidebar>
</template>
