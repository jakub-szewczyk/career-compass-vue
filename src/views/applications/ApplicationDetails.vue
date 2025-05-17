<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { CalendarIcon, Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import { computed } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { toDate } from 'reka-ui/date'
import {
  createApplication,
  getApplicationDetails,
  Status,
  updateApplication,
} from '@/services/application'
import StatusBadge from '@/components/domain/application/StatusBadge.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QUERY_KEYS } from '@/lib/query'
import { useTitle } from '@vueuse/core'
import { watch } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps({ isUpdating: { default: false } })

useTitle(`CareerCompass - ${props.isUpdating ? 'Edit' : 'New'} application`)

const VALIDATION_MESSAGES = {
  REQUIRED_COMPANY_NAME: 'Please enter the company name',
  REQUIRED_JOB_TITLE: 'Please enter the job title',
  REQUIRED_DATE_APPLIED: 'Please enter the application date',
  REQUIRED_STATUS: 'Please enter the status',
  MIN_SALARY: 'Please enter a salary of zero or more',
  INVALID_JOB_POSTING_URL: 'Please enter a valid URL',
}

const route = useRoute()
const router = useRouter()

const applicationId = route.params.applicationId as string

const queryClient = useQueryClient()

const { data, isLoading } = useQuery({
  queryKey: QUERY_KEYS.APPLICATION_DETAILS(applicationId),
  queryFn: () => getApplicationDetails(applicationId),
  enabled: props.isUpdating,
})

const { mutate: createApplicationMutate, isPending: isCreatingApplication } = useMutation({
  mutationFn: createApplication,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS() })
    router.push(ROUTES.APPLICATIONS.path)
  },
})

const { mutate: updateApplicationMutate, isPending: isUpdatingApplication } = useMutation({
  mutationFn: updateApplication,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS() })
    router.push(ROUTES.APPLICATIONS.path)
  },
})

const validationSchema = toTypedSchema(
  z.object({
    companyName: z
      .string({ required_error: VALIDATION_MESSAGES.REQUIRED_COMPANY_NAME })
      .min(1, VALIDATION_MESSAGES.REQUIRED_COMPANY_NAME),
    jobTitle: z
      .string({ required_error: VALIDATION_MESSAGES.REQUIRED_JOB_TITLE })
      .min(1, VALIDATION_MESSAGES.REQUIRED_JOB_TITLE),
    dateApplied: z.string({ required_error: VALIDATION_MESSAGES.REQUIRED_DATE_APPLIED }),
    status: z.nativeEnum(Status, {
      required_error: VALIDATION_MESSAGES.REQUIRED_STATUS,
    }),
    isReplied: z.boolean().default(false).optional(),
    minSalary: z.coerce.number().min(0, VALIDATION_MESSAGES.MIN_SALARY).optional(),
    maxSalary: z.coerce.number().min(0, VALIDATION_MESSAGES.MIN_SALARY).optional(),
    jobPostingURL: z
      .string()
      .url(VALIDATION_MESSAGES.INVALID_JOB_POSTING_URL)
      .or(z.literal(''))
      .optional(),
    notes: z.string().optional(),
  }),
)

const form = useForm({
  validationSchema,
  initialValues: { status: Status.InProgress },
})

watch(
  data,
  () => {
    if (props.isUpdating && data.value)
      form.resetForm({
        values: {
          companyName: data.value?.companyName,
          jobTitle: data.value?.jobTitle,
          dateApplied: data.value?.dateApplied.split('T')[0], // TODO: Format date properly
          status: data.value?.status as Status,
          isReplied: data.value.isReplied,
          minSalary: data.value?.minSalary,
          maxSalary: data.value?.maxSalary,
          jobPostingURL: data.value?.jobPostingURL,
          notes: data.value?.notes,
        },
      })
  },
  { immediate: true },
)

const dateApplied = computed({
  get: () => (form.values.dateApplied ? parseDate(form.values.dateApplied) : undefined),
  set: (value) => value,
})

const dateFormatter = new DateFormatter(navigator.language, { dateStyle: 'long' })

const handleSubmit = form.handleSubmit((values) =>
  props.isUpdating
    ? updateApplicationMutate({
      id: applicationId,
      ...values,
      dateApplied: new Date(values.dateApplied).toISOString(),
    })
    : createApplicationMutate({
      ...values,
      dateApplied: new Date(values.dateApplied).toISOString(),
    }),
)
</script>

<template>
  <h1 class="text-xl font-semibold">{{ props.isUpdating ? 'Edit' : 'New' }} application</h1>
  <p class="text-sm">Stay on top of your job search by logging your application details</p>
  <Card class="mt-14">
    <CardContent>
      <p class="mb-4 text-sm text-slate-500">Track your journey to the next opportunity</p>
      <form class="flex flex-col gap-y-4 xl:max-w-3/4" novalidate @submit="handleSubmit">
        <div class="flex flex-col items-start gap-4 md:flex-row">
          <FormField name="companyName" v-slot="{ componentField }">
            <FormItem class="w-full md:w-1/2">
              <FormLabel><span>Company<span :class="cn(
                'text-destructive',
                form.errors.value.companyName && 'text-destructive-foreground',
              )
                ">*</span></span></FormLabel>
              <Skeleton class="h-9 w-full" v-if="isLoading" />
              <FormControl v-else>
                <Input class="placeholder:font-light" type="text" placeholder="e.g., Evil Corp Inc."
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="jobTitle" v-slot="{ componentField }">
            <FormItem class="w-full md:w-1/2">
              <FormLabel><span>Job title<span :class="cn(
                'text-destructive',
                form.errors.value.jobTitle && 'text-destructive-foreground',
              )
                ">*</span></span></FormLabel>
              <Skeleton class="h-9 w-full" v-if="isLoading" />
              <FormControl v-else>
                <Input class="placeholder:font-light" type="text" placeholder="e.g., Software Engineer"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex flex-col items-start gap-4 md:flex-row">
          <FormField name="dateApplied">
            <FormItem class="flex w-full flex-col md:w-1/2">
              <FormLabel><span>Date applied<span :class="cn(
                'text-destructive',
                form.errors.value.dateApplied && 'text-destructive-foreground',
              )
                ">*</span></span></FormLabel>
              <Skeleton class="h-9 w-full" v-if="isLoading" />
              <Popover v-else>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button :class="cn(
                      'justify-start bg-white !font-light hover:bg-white',
                      !dateApplied && 'text-slate-400 hover:text-slate-400',
                    )
                      " variant="outline">
                      <CalendarIcon class="mr-1 size-3.5" />
                      <span>{{
                        dateApplied ? dateFormatter.format(toDate(dateApplied)) : 'MM/DD/YYYY' /*
                        TODO: Dynamic date format*/
                      }}</span>
                    </Button>
                    <input hidden />
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="dateApplied" calendarLabel="Date
                  applied" initialFocus :minValue="new CalendarDate(1900, 1, 1)" :maxValue="today(getLocalTimeZone())"
                    @update:modelValue="
                      (value) =>
                        value
                          ? form.setFieldValue('dateApplied', value.toString())
                          : form.setFieldValue('dateApplied', undefined)
                    " />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="status" v-slot="{ componentField }">
            <FormItem class="w-full md:w-1/2">
              <FormLabel><span>Status<span :class="cn(
                'text-destructive',
                form.errors.value.status && 'text-destructive-foreground',
              )
                ">*</span></span></FormLabel>
              <Select v-bind="componentField">
                <Skeleton class="h-9 w-full" v-if="isLoading" />
                <FormControl v-else>
                  <SelectTrigger class="w-full bg-white font-light">
                    <SelectValue>
                      <StatusBadge :status="form.values.status!" />
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem :value="Status.InProgress">
                      <StatusBadge :status="Status.InProgress" />
                    </SelectItem>
                    <SelectItem :value="Status.Rejected">
                      <StatusBadge :status="Status.Rejected" />
                    </SelectItem>
                    <SelectItem :value="Status.Accepted">
                      <StatusBadge :status="Status.Accepted" />
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex flex-col items-start gap-4 md:flex-row" v-if="props.isUpdating">
          <FormField name="isReplied" type="checkbox" v-slot="{ value, handleChange }">
            <FormItem class="flex">
              <FormControl>
                <Skeleton class="size-4 rounded-[4px]" v-if="isLoading" />
                <Checkbox :model-value="value" @update:model-value="handleChange" v-else />
              </FormControl>
              <div class="space-y-1.5 ">
                <FormLabel>Replied</FormLabel>
                <FormDescription>
                  Check if you received a reply to your application
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>
        </div>
        <div class="flex flex-col items-start gap-4 md:flex-row">
          <FormField name="minSalary" v-slot="{ componentField }">
            <FormItem class="w-full md:w-1/2">
              <FormLabel>Min salary</FormLabel>
              <Skeleton class="h-9 w-full" v-if="isLoading" />
              <FormControl v-else>
                <Input class="placeholder:font-light" type="number" min="0" placeholder="$50,000"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="maxSalary" v-slot="{ componentField }">
            <FormItem class="w-full md:w-1/2">
              <FormLabel>Max salary</FormLabel>
              <Skeleton class="h-9 w-full" v-if="isLoading" />
              <FormControl v-else>
                <Input class="placeholder:font-light" type="number" min="0" placeholder="$70,000"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <FormField name="jobPostingURL" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Job posting URL</FormLabel>
            <Skeleton class="h-9 w-full" v-if="isLoading" />
            <FormControl v-else>
              <Input class="placeholder:font-light" type="text"
                placeholder="e.g., https://glassbore.com/jobs/swe420692137" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="notes" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <Skeleton class="h-16 w-full" v-if="isLoading" />
            <FormControl v-else>
              <Textarea class="resize-none" placeholder="e.g., Follow up in two weeks" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="mt-2 flex flex-col-reverse flex-wrap gap-2 md:flex-row">
          <Button class="text-primary hover:text-primary w-full md:w-auto" type="button" variant="ghost" asChild>
            <RouterLink :to="ROUTES.APPLICATIONS.path">Cancel</RouterLink>
          </Button>
          <Button class="w-full md:w-auto" type="submit"
            :disabled="isLoading || isCreatingApplication || isUpdatingApplication">
            <Loader2 class="mr-2 size-4 animate-spin" v-if="isCreatingApplication || isUpdatingApplication" />
            Submit
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
