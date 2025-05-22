<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'

defineProps<{
  isPending: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()
</script>

<template>
  <AlertDialog>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete application</AlertDialogTitle>
        <AlertDialogDescription
          >Are you sure you want to delete this application? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel class="mt-0">Cancel</AlertDialogCancel>
        <Button variant="destructive" @click="() => emit('confirm')" :disabled="isPending">
          <Loader2 class="mr-2 size-4 animate-spin" v-if="isPending" />
          Yes, delete
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
