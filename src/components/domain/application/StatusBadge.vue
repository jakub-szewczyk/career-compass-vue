<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Status } from '@/services/application'

const props = defineProps<{
  status: `${Status}`
}>()
</script>

<template>
  <Badge
    :class="
      cn(
        'py-0 text-sm',
        props.status === Status.InProgress && 'bg-sky-100 text-sky-900',
        props.status === Status.Rejected && 'bg-red-100 text-red-900',
        props.status === Status.Accepted && 'bg-emerald-100 text-emerald-900',
      )
    "
  >
    {{
      props.status === Status.InProgress
        ? 'In progress'
        : props.status === Status.Rejected
          ? 'Rejected'
          : props.status === Status.Accepted
            ? 'Accepted'
            : 'Unknown'
    }}
  </Badge>
</template>
