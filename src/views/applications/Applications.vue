<script setup lang="ts">
import { snakeCase } from 'lodash'
import DropdownAction from '@/components/domain/application/ActionDropdown.vue'
import localeCurrency from 'locale-currency'
import { Input } from '@/components/ui/input'
import { QUERY_KEYS } from '@/lib/query'
import { getApplications, type Sort, type Status } from '@/services/application'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { refDebounced, useTitle } from '@vueuse/core'
import { ArrowDown, ArrowUp, Check, Plus, Search } from 'lucide-vue-next'
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
import type { ColumnDef, PaginationState } from '@tanstack/vue-table'
import { h } from 'vue'
import DataTable from '@/components/common/DataTable.vue'
import StatusBadge from '@/components/domain/application/StatusBadge.vue'
import { watch } from 'vue'
import { shallowRef } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'

type Application = Awaited<ReturnType<typeof getApplications>>['data'][number]

const DEBOUNCE_DELAY = 500
const INITIAL_PAGE = 0
const INITIAL_SIZE = 10

useTitle('CareerCompass - Applications')

const companyNameOrJobTitle = shallowRef('')
const debouncedCompanyNameOrJobTitle = refDebounced(companyNameOrJobTitle, DEBOUNCE_DELAY)
const dateApplied = ref<DateValue>()
const status = ref<Status>()
const sort = ref<Sort>()
const page = ref(INITIAL_PAGE)
const size = ref(INITIAL_SIZE)

const { data, isLoading, isRefetching } = useQuery({
  queryKey: QUERY_KEYS.APPLICATIONS({
    companyNameOrJobTitle: debouncedCompanyNameOrJobTitle,
    dateApplied,
    status,
    sort,
    page,
    size,
  }),
  queryFn: () =>
    getApplications({
      ...(debouncedCompanyNameOrJobTitle.value && {
        company_name_or_job_title: debouncedCompanyNameOrJobTitle.value,
      }),
      ...(dateApplied.value && { date_applied: dateApplied.value.toString() }),
      ...(status.value && { status: status.value }),
      ...(sort.value && { sort: sort.value }),
      page: page.value,
      size: size.value,
    }),
  placeholderData: keepPreviousData,
})


watch([debouncedCompanyNameOrJobTitle, dateApplied, status, sort], () => {
  page.value = INITIAL_PAGE
})

const skeletonCell = h(Skeleton, { class: 'h-5' })

const columns: ColumnDef<Application>[] = [
  {
    accessorKey: 'companyName',
    header: ({ column }) =>
      h(
        'div',
        { class: 'w-[150px] text-slate-500' },
        h(
          Button,
          {
            class: 'h-fit !px-0',
            size: 'sm',
            variant: 'ghost',
            onClick: () => handleSortingChange(column.id),
          },
          () => ['Company', sortingIndicator(column.id)],
        ),
      ),
    cell: ({ row }) =>
      isLoading.value
        ? skeletonCell
        : h(
          'div',
          {
            class: cn(isRefetching.value && 'opacity-50'),
          },
          row.getValue('companyName'),
        ),
  },
  {
    accessorKey: 'jobTitle',
    header: ({ column }) => h('div', { class: 'w-[150px] text-slate-500' }, h(Button, {
      class: 'h-fit !px-0',
      size: 'sm',
      variant: 'ghost', onClick: () => handleSortingChange(column.id)
    }, () => ['Job title', sortingIndicator(column.id)])),
    cell: ({ row }) =>
      isLoading.value
        ? skeletonCell
        : h(
          'div',
          {
            class: cn(isRefetching.value && 'opacity-50'),
          },
          row.getValue('jobTitle'),
        ),
  },
  {
    accessorKey: 'dateApplied',
    header: ({ column }) => h('div', { class: 'w-[90px] text-slate-500' }, h(Button, {
      class: 'h-fit !px-0',
      size: 'sm',
      variant: 'ghost',
      onClick: () => handleSortingChange(column.id)
    }, () => ['Date applied', sortingIndicator(column.id)])),
    cell: ({ row }) => {
      const dateFormatter = new DateFormatter(navigator.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      return isLoading.value
        ? skeletonCell
        : h(
          'div',
          {
            class: cn(isRefetching.value && 'opacity-50'),
          },
          dateFormatter.format(new Date(row.getValue('dateApplied'))),
        )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h('div', { class: 'w-[100px] text-slate-500' }, h(Button, {
      class: 'h-fit !px-0',
      size: 'sm',
      variant: 'ghost',
      onClick: () => handleSortingChange(column.id)
    }, () => ['Status', sortingIndicator(column.id)])),
    cell: ({ row }) => {
      const status = row.getValue('status') as Status
      return isLoading.value
        ? skeletonCell
        : h(StatusBadge, {
          status,
          class: cn(isRefetching.value && 'opacity-50'),
        })
    },
  },
  {
    accessorKey: 'salary',
    header: ({ column }) => h('div', { class: 'w-[150px] text-slate-500' }, h(Button, {
      class: 'h-fit !px-0',
      size: 'sm',
      variant: 'ghost',
      onClick: () => handleSortingChange(column.id)
    }, () => ['Salary', sortingIndicator(column.id)])),
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

      return isLoading.value
        ? skeletonCell
        : h(
          'div',
          {
            class: cn(isRefetching.value && 'opacity-50'),
          },
          salary,
        )
    },
  },
  {
    accessorKey: 'isReplied',
    header: ({ column }) => h('div', { class: 'w-[50px] text-slate-500' }, h(Button, {
      class: 'h-fit !px-0',
      size: 'sm',
      variant: 'ghost',
      onClick: () => handleSortingChange(column.id)
    }, () => ['Replied', sortingIndicator(column.id)])),
    cell: ({ row }) => {
      const isReplied = row.getValue('isReplied')

      return isLoading.value
        ? skeletonCell
        : h('div', { class: cn('flex items-center gap-x-1', isRefetching.value && 'opacity-50') }, [
          isReplied ? 'Yes' : 'No',
          h(isReplied ? Check : X, {
            class: cn('size-3.5', isReplied ? 'text-primary' : 'text-red-900'),
          }),
        ])
    },
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'w-[40px] text-slate-500' }),
    cell: () => h('div', { class: 'relative' }, h(DropdownAction)),
  },
]

const dateFormatter = new DateFormatter(navigator.language, { dateStyle: 'long' })

const sortingIndicator = (columnId: string) => {
  const value = snakeCase(columnId) as Sort
  if (sort.value === value) return h(ArrowUp, { class: 'size-3.5' })
  if (sort.value === `-${value}`) return h(ArrowDown, { class: 'size-3.5' })
  return null
}

const handleFiltersClear = () => {
  companyNameOrJobTitle.value = ''
  dateApplied.value = undefined
  status.value = undefined
}

const handleSortingChange = (columnId: string) => {
  const value = snakeCase(columnId) as Sort
  if (sort.value === value) return sort.value = `-${value}` as Sort | undefined
  if (sort.value === `-${value}`) return sort.value = undefined
  sort.value = value
}

const handlePaginationChange = ({ pageSize, pageIndex }: PaginationState) => {
  size.value = pageSize
  page.value = pageIndex
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
        <Input class="bg-white pl-9 placeholder:text-sm placeholder:font-light placeholder:text-slate-400"
          placeholder="Filter by company name or job title" v-model="companyNameOrJobTitle" />
        <span class="absolute inset-y-0 start-0 flex items-center justify-center px-3">
          <Search class="size-3.5 text-slate-400" />
        </span>
      </div>

      <Popover>
        <PopoverTrigger as-child>
          <Button class="bg-white !font-light hover:bg-white" variant="outline" :class="cn(
            'w-full justify-start text-left font-normal sm:max-w-[185px]',
            !dateApplied && 'text-slate-400 hover:text-slate-400',
          )
            ">
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
        <SelectTrigger class="w-full bg-white font-light sm:max-w-[150px] [[data-placeholder]]:!text-slate-400">
          <SelectValue placeholder="Filter by status">
            <StatusBadge :status="status" v-if="status" />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="IN_PROGRESS">
              <StatusBadge status="IN_PROGRESS" />
            </SelectItem>
            <SelectItem value="REJECTED">
              <StatusBadge status="REJECTED" />
            </SelectItem>
            <SelectItem value="ACCEPTED">
              <StatusBadge status="ACCEPTED" />
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button class="bg-white" variant="outline" v-if="companyNameOrJobTitle || dateApplied || status"
        @click="handleFiltersClear">
        <X /> Clear
      </Button>
    </div>

    <Button class="w-full sm:w-fit">
      <Plus /> New application
    </Button>
  </div>

  <DataTable class="bg-white [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3" :columns="columns"
    :data="data?.data || Array(size).fill({})" :pagination="{
      page,
      size,
      total: data?.total || 0,
      onChange: handlePaginationChange,
    }" />
</template>
