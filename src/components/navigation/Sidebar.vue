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
  TextCursor,
} from 'lucide-vue-next'
import { Button } from '../ui/button'
import { useRoute, useRouter } from 'vue-router'
import { cn } from '@/lib/utils'
import { useLocalStorage } from '@vueuse/core'

const token = useLocalStorage<string | null>('token', null)

const route = useRoute()
const router = useRouter()

const { openMobile, setOpenMobile, toggleSidebar } = useSidebar()

router.afterEach((to, from) => openMobile && to.path !== from.path && setOpenMobile(false))

const handleSignOut = () => {
  token.value = null
  router.push(ROUTES.SIGN_IN.path)
}
</script>

<template>
  <Sidebar collapsible="icon">
    <div class="mb-3 mt-2 lg:mt-4">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton class="hover:bg-transparent active:bg-transparent pointer-events-none" asChild>
                <div>
                  <Compass class="!size-6" />
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
              <SidebarMenuButton :isActive="route.path === ROUTES.DASHBOARD.path" asChild>
                <RouterLink :class="cn(route.path !== ROUTES.DASHBOARD.path && '!text-slate-500')"
                  :to="ROUTES.DASHBOARD.path">
                  <Home class="!size-5" />
                  <span>Home</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel class="uppercase text-slate-500 text-[10px] font-semibold">Job search</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton :isActive="route.path === ROUTES.RESUMES.path" asChild>
                <RouterLink :class="cn(route.path !== ROUTES.RESUMES.path && '!text-slate-500')"
                  :to="ROUTES.RESUMES.path">
                  <TextCursor class="!size-5" />
                  <span>Resumes</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton :isActive="route.path === ROUTES.INTERVIEWS.path" asChild>
                <RouterLink :class="cn(route.path !== ROUTES.INTERVIEWS.path && '!text-slate-500')"
                  :to="ROUTES.INTERVIEWS.path">
                  <Calendar class="!size-5" />
                  <span>Interviews</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton :isActive="route.path === ROUTES.APPLICATIONS.path" asChild>
                <RouterLink :class="cn(route.path !== ROUTES.APPLICATIONS.path && '!text-slate-500')"
                  :to="ROUTES.APPLICATIONS.path">
                  <Briefcase class="!size-5" />
                  <span>Applications</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel class="uppercase text-slate-500 text-[10px] font-semibold">Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton :isActive="route.path === ROUTES.SETTINGS.path" asChild>
                <RouterLink :class="cn(route.path !== ROUTES.SETTINGS.path && '!text-slate-500')"
                  :to="ROUTES.SETTINGS.path">
                  <Settings2 class="!size-5" />
                  <span>Settings</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button class="cursor-pointer justify-start text-slate-500 hover:text-slate-500
                  active:text-slate-500" variant="ghost" @click="handleSignOut">
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
                <Button class="cursor-pointer justify-start text-slate-500 hover:text-slate-500 active:text-slate-500"
                  variant="ghost" @click="toggleSidebar">
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
