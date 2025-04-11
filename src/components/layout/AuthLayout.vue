<script setup lang="ts">
import { Compass } from 'lucide-vue-next'

defineProps({
  title: String,
  subtitle: {
    type: String,
    default: 'Your journey to career success starts here',
  },
})
</script>

<template>
  <div class="flex">
    <div
      class="flex h-screen w-full flex-col items-center justify-between gap-y-4 lg:w-1/2 xl:w-3/5"
    >
      <div class="mt-4 ml-4 flex items-center gap-x-2 self-start lg:mt-6 lg:ml-6">
        <Compass />
        <span class="text-lg font-semibold">CareerCompass</span>
      </div>
      <div class="flex w-11/12 max-w-sm flex-col gap-y-4 xl:max-w-md">
        <div class="text-center">
          <h1 class="text-xl font-semibold">{{ title }}</h1>
          <p>{{ subtitle }}</p>
        </div>
        <slot></slot>
      </div>
      <p class="px-4 pb-4 text-center text-xs text-slate-500 lg:px-6 lg:pb-6">
        Your next opportunity is just a step away. Let's chart the path together.
      </p>
    </div>
    <div
      class="bg-primary hidden flex-col items-center justify-center gap-y-4 lg:flex lg:w-1/2 xl:w-2/5"
    >
      <img class="w-11/12" src="@/assets/auth.svg" alt="" />
      <div class="text-center">
        <p class="text-lg font-semibold text-white 2xl:text-xl">Track. Organize. Achieve.</p>
        <p class="text-sm font-light text-white 2xl:text-base">
          Stay on top of your job applications and reach your goals with ease!
        </p>
      </div>
    </div>
  </div>
</template>
