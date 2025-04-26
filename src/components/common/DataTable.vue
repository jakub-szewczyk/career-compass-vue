<script setup lang="ts" generic="TData, TValue">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ColumnDef, PaginationState } from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination: {
    page: number
    size: number
    total: number
    onChange: (paginationState: PaginationState) => void
  }
}>()

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
  state: {
    pagination: {
      pageSize: props.pagination.size,
      pageIndex: props.pagination.page,
    },
  },
  onPaginationChange: (updater) => {
    if (typeof updater !== 'function') return
    props.pagination.onChange(
      updater({
        pageSize: props.pagination.size,
        pageIndex: props.pagination.page,
      }),
    )
  },
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const smallerThanLg = breakpoints.smaller('lg')
</script>

<template>
  <div class="rounded-md border" :class="$attrs.class">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center"> No results </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>

  <div class="mt-4 flex items-center justify-end gap-x-2 xl:justify-between">
    <div class="hidden text-sm font-normal text-slate-500 xl:block">
      Showing <span class="text-black">{{ props.pagination.size }}</span> of
      <span class="text-black">{{ props.pagination.total }}</span> results
    </div>

    <div class="flex items-center gap-x-4">
      <div class="flex items-center gap-x-2 text-nowrap">
        <div class="hidden text-sm font-normal text-slate-500 xl:block">Results per page</div>
        <Select
          :modelValue="props.pagination.size"
          @update:modelValue="(value) => table.setPageSize(value as number)"
        >
          <SelectTrigger
            class="w-full bg-white font-light sm:max-w-[150px] [[data-placeholder]]:!text-slate-400"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem :value="10"> 10 </SelectItem>
              <SelectItem :value="20"> 20 </SelectItem>
              <SelectItem :value="50"> 50 </SelectItem>
              <SelectItem :value="100"> 100 </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Pagination
        class="justify-end"
        :page="props.pagination.page + 1"
        :itemsPerPage="props.pagination.size"
        :total="props.pagination.total"
        :siblingCount="1"
        showEdges
        v-slot="{ page }"
        @update:page="(value) => table.setPageIndex(value - 1)"
      >
        <PaginationContent class="flex items-center gap-1" v-slot="{ items }">
          <PaginationFirst asChild>
            <Button size="icon" variant="ghost">
              <ChevronsLeft />
            </Button>
          </PaginationFirst>
          <PaginationPrevious asChild>
            <Button size="icon" variant="ghost">
              <ChevronLeft />
            </Button>
          </PaginationPrevious>
          <template v-if="smallerThanLg">
            <PaginationItem :value="props.pagination.page + 1" asChild>
              <Button variant="ghost">
                {{ props.pagination.page + 1 }}
              </Button>
            </PaginationItem>
          </template>
          <template v-else v-for="(item, index) in items">
            <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value" asChild>
              <Button
                :class="cn('size-9 p-0', item.value === page && 'bg-white hover:bg-white')"
                :variant="item.value === page ? 'outline' : 'ghost'"
              >
                {{ item.value }}
              </Button>
            </PaginationItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>
          <PaginationNext asChild>
            <Button size="icon" variant="ghost">
              <ChevronRight />
            </Button>
          </PaginationNext>
          <PaginationLast asChild>
            <Button size="icon" variant="ghost">
              <ChevronsRight />
            </Button>
          </PaginationLast>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
