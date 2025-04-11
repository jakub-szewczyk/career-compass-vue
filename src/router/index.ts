import SignIn from '@/views/auth/SignIn.vue'
import SignUp from '@/views/auth/SignUp.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sign-in',
      name: 'Sign in',
      component: SignIn,
    },
    {
      path: '/sign-up',
      name: 'Sign up',
      component: SignUp,
    },
    {
      path: '/forgot-password',
      name: 'Forgot password',
      component: ForgotPassword,
    },
  ],
})

export default router
