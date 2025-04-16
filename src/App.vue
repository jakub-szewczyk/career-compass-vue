<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { RouterView } from 'vue-router'
import { Toaster } from './components/ui/sonner'
</script>

<template>
  <RouterView />
  <VueQueryDevtools />
  <Toaster richColors />
</template>

<style scoped></style>
