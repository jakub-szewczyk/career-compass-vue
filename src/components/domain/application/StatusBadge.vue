<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Status } from '@/services/application'

const props = defineProps<{
  status: Status
}>()
</script>

<template>
  <Badge
    :class="
      cn(
        'py-0 text-sm',
        props.status === 'IN_PROGRESS' && 'bg-sky-100 text-sky-900',
        props.status === 'REJECTED' && 'bg-red-100 text-red-900',
        props.status === 'ACCEPTED' && 'bg-emerald-100 text-emerald-900',
      )
    "
  >
    {{
      props.status === 'IN_PROGRESS'
        ? 'In progress'
        : props.status === 'REJECTED'
          ? 'Rejected'
          : props.status === 'ACCEPTED'
            ? 'Accepted'
            : 'Unknown'
    }}
  </Badge>
</template>
