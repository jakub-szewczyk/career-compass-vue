import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'
import { AxiosError } from 'axios'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { toast } from 'vue-sonner'
import App from './App.vue'
import './index.css'
import router from './router'

declare module '@tanstack/query-core' {
  interface Register {
    defaultError: AxiosError<{ error: string }>
  }
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      mutations: {
        onError: (error) => {
          const message = error.response?.data.error

          toast.error('Error occurred', {
            description: message
              ? message[0].toUpperCase() + message.slice(1)
              : 'Unknown issue encountered',
          })
        },
      },
    },
  },
}

app.use(VueQueryPlugin, vueQueryPluginOptions)

app.mount('#app')
