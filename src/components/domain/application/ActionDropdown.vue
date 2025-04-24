<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, SquarePen, Trash } from 'lucide-vue-next'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button class="float-right size-8 p-0" variant="ghost">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel> Actions </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="flex cursor-pointer items-center gap-x-2">
        <SquarePen class="size-4 text-base" />Edit
      </DropdownMenuItem>
      <DropdownMenuItem
        class="flex cursor-pointer items-center gap-x-2 text-red-900 hover:!text-red-900"
      >
        <Trash class="size-4 text-red-900" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
