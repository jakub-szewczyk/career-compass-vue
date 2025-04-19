<script setup lang="ts">
import { ROUTES } from '@/router'
import { useLocalStorage, useTitle } from '@vueuse/core'
import { ArrowLeft, Compass } from 'lucide-vue-next'

useTitle('CareerCompass - Not found')

const token = useLocalStorage<string | null>('token', null)
</script>

<template>
  <div class="flex h-screen w-full flex-col items-center justify-between gap-y-4">
    <div class="mt-4 ml-4 flex items-center gap-x-2 self-start lg:mt-6">
      <Compass />
      <span class="text-lg font-semibold">CareerCompass</span>
    </div>
    <div class="flex max-w-xs flex-col gap-y-4 sm:max-w-sm md:max-w-md lg:max-w-lg">
      <img class="w-full" src="@/assets/not-found.svg" alt="" />
      <RouterLink
        class="text-foreground mx-auto flex w-fit items-center gap-x-2 text-sm font-semibold hover:underline"
        :to="token ? ROUTES.DASHBOARD.path : ROUTES.SIGN_IN.path"
      >
        <ArrowLeft class="size-4" /> <span v-if="token">Back to dashboard</span
        ><span v-else>Back to sign in</span>
      </RouterLink>
    </div>
    <p class="px-4 pb-4 text-center text-xs text-slate-500 lg:px-6 lg:pb-6">
      Your next opportunity is just a step away. Let's chart the path together.
    </p>
  </div>
</template>
