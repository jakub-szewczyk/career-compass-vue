import SignIn from '@/views/SignIn.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sign-in',
      name: 'Sign in',
      component: SignIn,
    },
  ],
})

export default router
