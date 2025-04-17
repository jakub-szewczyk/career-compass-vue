<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { Toaster } from './components/ui/sonner'
</script>

<template>
  <RouterView />
  <Toaster richColors />
  <VueQueryDevtools />
</template>

<style scoped></style>
