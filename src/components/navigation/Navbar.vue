<script setup lang="ts">
import { Menu } from 'lucide-vue-next';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';

const { isMobile, toggleSidebar } = useSidebar()
</script>

<template>
  <header class="flex justify-between mb-5.5">
    <Button :class="cn('invisible', isMobile && 'visible')" variant="outline" size="icon" @click="toggleSidebar">
      <Menu />
    </Button>
    <Avatar class="size-10">
      <AvatarFallback class="bg-slate-200">JS</AvatarFallback>
    </Avatar>
  </header>
</template>
