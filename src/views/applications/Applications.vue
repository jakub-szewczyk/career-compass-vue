<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { QUERY_KEYS } from '@/lib/query'
import { getApplications } from '@/services/application'
import { useQuery } from '@tanstack/vue-query'
import { useTitle } from '@vueuse/core'
import { Search } from 'lucide-vue-next'
import type { DateRange } from 'reka-ui'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { type Ref, ref } from 'vue'
import { cn } from '@/lib/utils'

useTitle('CareerCompass - Applications')

const { data } = useQuery({
  queryKey: QUERY_KEYS.APPLICATIONS,
  queryFn: () => getApplications(),
})

const dateFormatter = new DateFormatter(navigator.language, { dateStyle: 'medium' })

const dateRange = ref({}) as Ref<DateRange>
</script>

<template>
  <h1 class="text-xl font-semibold">Your job applications 💼</h1>
  <p class="text-sm">
    All your job applications, all in one place. Track, manage, and conquer your career goals!
  </p>

  <div class="mt-14 mb-4 flex items-center gap-x-4">
    <div class="relative w-full max-w-[270px] items-center">
      <Input
        class="bg-white pl-9 placeholder:text-sm placeholder:font-light placeholder:text-slate-400"
        placeholder="Filter by company name or job title"
      />
      <span class="absolute inset-y-0 start-0 flex items-center justify-center px-3">
        <Search class="size-3.5 text-slate-400" />
      </span>
    </div>

    <Popover>
      <PopoverTrigger as-child>
        <Button
          :class="
            cn(
              'w-fit justify-start bg-white text-left font-light',
              !dateRange.start && '!text-slate-400',
            )
          "
          variant="outline"
        >
          <CalendarIcon class="mr-1 size-3.5" />
          <template v-if="dateRange.start">
            <template v-if="dateRange.end">
              {{ dateFormatter.format(dateRange.start.toDate(getLocalTimeZone())) }} -
              {{ dateFormatter.format(dateRange.end.toDate(getLocalTimeZone())) }}
            </template>
            <template v-else>
              {{ dateFormatter.format(dateRange.start.toDate(getLocalTimeZone())) }}
            </template>
          </template>
          <template v-else> Filter by date applied </template>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <RangeCalendar
          initial-focus
          :number-of-months="2"
          v-model="dateRange"
          @update:start-value="(startDate) => (dateRange.start = startDate)"
        />
      </PopoverContent>
    </Popover>
  </div>

  <pre>{{ JSON.stringify(data, null, 2) }}</pre>
</template>
