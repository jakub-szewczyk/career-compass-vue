<script setup lang="ts">
import Stage from '@/components/domain/resume/Stage.vue'
import { useTitle } from '@vueuse/core'

useTitle('CareerCompass - Resume editor')
</script>

<template>
  <h1 class="text-xl font-semibold">Resume editor</h1>
  <p class="text-sm">Your resume, your way. Edit and refine to showcase your best self.</p>
  <div class="mt-14">
    <Stage />
  </div>
</template>
