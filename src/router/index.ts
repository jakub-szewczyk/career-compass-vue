import Applications from '@/views/applications/Applications.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import SignIn from '@/views/auth/SignIn.vue'
import SignUp from '@/views/auth/SignUp.vue'
import Dashboard from '@/views/dashboard/Dashboard.vue'
import Interviews from '@/views/interviews/Interviews.vue'
import NotFound from '@/views/other/NotFound.vue'
import Resumes from '@/views/resumes/Resumes.vue'
import Settings from '@/views/settings/Settings.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// TODO: Type-safe meta property
export const ROUTES = {
  SIGN_IN: { name: 'Sign in', path: '/sign-in', component: SignIn, meta: { isPrivate: false } },
  SIGN_UP: { name: 'Sign up', path: '/sign-up', component: SignUp, meta: { isPrivate: false } },
  FORGOT_PASSWORD: {
    name: 'Forgot password',
    path: '/forgot-password',
    component: ForgotPassword,
    meta: { isPrivate: false },
  },
  RESET_PASSWORD: {
    name: 'Reset password',
    path: '/reset-password',
    component: ResetPassword,
    meta: { isPrivate: false },
  },
  DASHBOARD: { name: 'Dashboard', path: '/', component: Dashboard, meta: { isPrivate: true } },
  RESUMES: { name: 'Resumes', path: '/resumes', component: Resumes, meta: { isPrivate: true } },
  INTERVIEWS: {
    name: 'Interviews',
    path: '/interviews',
    component: Interviews,
    meta: { isPrivate: true },
  },
  APPLICATIONS: {
    name: 'Applications',
    path: '/applications',
    component: Applications,
    meta: { isPrivate: true },
  },
  SETTINGS: {
    name: 'Settings',
    path: '/settings',
    component: Settings,
    meta: { isPrivate: true },
  },
  NOT_FOUND: {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    component: NotFound,
    meta: { isPrivate: false },
  },
} as const satisfies Record<string, RouteRecordRaw>

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: Object.values(ROUTES),
})

router.beforeEach((to, _, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.isPrivate && !token)
    next({
      name: ROUTES.SIGN_IN.name,
      replace: true,
      query: {
        ...(to.path !== ROUTES.DASHBOARD.path && {
          redirect: to.fullPath,
        }),
      },
    })

  if (
    (
      [
        ROUTES.SIGN_IN.path,
        ROUTES.SIGN_UP.path,
        ROUTES.FORGOT_PASSWORD.path,
        ROUTES.RESET_PASSWORD.path,
      ] as string[]
    ).includes(to.path) &&
    token
  )
    next({ name: ROUTES.DASHBOARD.name, replace: true })

  next()
})

export default router
