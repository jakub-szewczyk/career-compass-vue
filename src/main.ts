import {
  MutationCache,
  QueryCache,
  VueQueryPlugin,
  type VueQueryPluginOptions,
} from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { toast } from 'vue-sonner'
import App from './App.vue'
import './index.css'
import router from './router'
import type { ApiError } from './services/api'

declare module '@tanstack/query-core' {
  interface Register {
    defaultError: ApiError
  }
}

const app = createApp(App)

app.use(createPinia())

app.use(router)

const handleError = (error: ApiError) => {
  const message = error.response?.data.error

  toast.error('Error occurred', {
    description: message
      ? message[0].toUpperCase() + message.slice(1)
      : 'Unknown issue encountered',
  })
}

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    queryCache: new QueryCache({ onError: handleError }),
    mutationCache: new MutationCache({ onError: handleError }),
  },
}

app.use(VueQueryPlugin, vueQueryPluginOptions)

router.isReady().then(() => app.mount('#app'))
