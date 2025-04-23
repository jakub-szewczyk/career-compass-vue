<script setup lang="ts">
import localeCurrency from 'locale-currency'
import { Input } from '@/components/ui/input'
import { QUERY_KEYS } from '@/lib/query'
import { getApplications, type Status } from '@/services/application'
import { useQuery } from '@tanstack/vue-query'
import { useTitle } from '@vueuse/core'
import { Plus, Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date'
import { CalendarIcon, X } from 'lucide-vue-next'
import { ref } from 'vue'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import DataTable from '@/components/common/DataTable.vue'

type Application = Awaited<ReturnType<typeof getApplications>>['data'][number]

useTitle('CareerCompass - Applications')

const companyNameOrJobTitle = ref('')
const dateApplied = ref<DateValue>()
const status = ref<Status>()

const { data } = useQuery({
  queryKey: QUERY_KEYS.APPLICATIONS,
  queryFn: () => getApplications(),
})

const columns: ColumnDef<Application>[] = [
  {
    accessorKey: 'companyName',
    header: () => h('div', null, 'Company'),
    cell: ({ row }) => h('div', null, row.getValue('companyName')),
  },
  {
    accessorKey: 'jobTitle',
    header: () => h('div', null, 'Job title'),
    cell: ({ row }) => h('div', null, row.getValue('jobTitle')),
  },
  {
    accessorKey: 'dateApplied',
    header: () => h('div', null, 'Date applied'),
    cell: ({ row }) => {
      const dateFormatter = new DateFormatter(navigator.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      return h('div', null, dateFormatter.format(new Date(row.getValue('dateApplied'))))
    },
  },
  {
    accessorKey: 'status',
    header: () => h('div', null, 'Status'),
    cell: ({ row }) => h('div', null, row.getValue('status')),
  },
  {
    accessorKey: 'salary',
    header: () => h('div', null, 'Salary'),
    cell: ({ row }) => {
      const numberFormat = new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currency: localeCurrency.getCurrency(navigator.language) || 'USD',
      })

      let salary: string | undefined = undefined

      if (typeof row.original.minSalary === 'number' && typeof row.original.maxSalary === 'number')
        salary = `${numberFormat.format(row.original.minSalary)} - ${numberFormat.format(row.original.maxSalary)}`

      if (typeof row.original.minSalary === 'number' && row.original.maxSalary === undefined)
        salary = numberFormat.format(row.original.minSalary)

      if (row.original.minSalary === undefined && typeof row.original.maxSalary === 'number')
        salary = numberFormat.format(row.original.maxSalary)

      return h('div', null, salary)
    },
  },
  {
    accessorKey: 'isReplied',
    header: () => h('div', null, 'Replied'),
    cell: ({ row }) => h('div', null, row.getValue('isReplied') ? 'Yes' : 'No'),
  },
]

const dateFormatter = new DateFormatter(navigator.language, { dateStyle: 'long' })

const handleClear = () => {
  companyNameOrJobTitle.value = ''
  dateApplied.value = undefined
  status.value = undefined
}
</script>

<template>
  <h1 class="text-xl font-semibold">Your job applications 💼</h1>
  <p class="text-sm">
    All your job applications, all in one place. Track, manage, and conquer your career goals!
  </p>

  <div class="mt-14 mb-4 flex flex-wrap justify-between gap-4">
    <div class="flex grow-[1] flex-col flex-wrap gap-4 sm:flex-row">
      <div class="relative w-full items-center sm:max-w-[270px]">
        <Input
          class="bg-white pl-9 placeholder:text-sm placeholder:font-light placeholder:text-slate-400"
          placeholder="Filter by company name or job title"
          v-model="companyNameOrJobTitle"
        />
        <span class="absolute inset-y-0 start-0 flex items-center justify-center px-3">
          <Search class="size-3.5 text-slate-400" />
        </span>
      </div>

      <Popover>
        <PopoverTrigger as-child>
          <Button
            class="bg-white !font-light hover:bg-white"
            variant="outline"
            :class="
              cn(
                'w-full justify-start text-left font-normal sm:max-w-[185px]',
                !dateApplied && 'text-slate-400 hover:text-slate-400',
              )
            "
          >
            <CalendarIcon class="mr-1 size-3.5" />
            {{
              dateApplied
                ? dateFormatter.format(dateApplied.toDate(getLocalTimeZone()))
                : 'Filter by date applied'
            }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar v-model="dateApplied" initial-focus />
        </PopoverContent>
      </Popover>

      <Select v-model="status">
        <SelectTrigger
          class="w-full bg-white font-light sm:max-w-[150px] [[data-placeholder]]:!text-slate-400"
        >
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="IN_PROGRESS"> In progress </SelectItem>
            <SelectItem value="REJECTED"> Rejected </SelectItem>
            <SelectItem value="ACCEPTED"> Accepted </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        class="bg-white"
        variant="outline"
        v-if="companyNameOrJobTitle || dateApplied || status"
        @click="handleClear"
      >
        <X /> Clear
      </Button>
    </div>

    <Button class="w-full sm:w-fit"> <Plus /> New application </Button>
  </div>

  <div class="container mx-auto py-10">
    <DataTable class="bg-white" :columns="columns" :data="data?.data || []" />
  </div>
</template>
