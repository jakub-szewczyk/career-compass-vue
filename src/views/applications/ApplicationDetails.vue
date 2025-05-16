<script setup lang="ts">
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
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/router'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { CalendarIcon, Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { computed } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { toDate } from 'reka-ui/date'
import { createApplication, Status } from '@/services/application'
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

const VALIDATION_MESSAGES = {
  REQUIRED_COMPANY_NAME: 'Please enter the company name',
  REQUIRED_JOB_TITLE: 'Please enter the job title',
  REQUIRED_DATE_APPLIED: 'Please enter the application date',
  REQUIRED_STATUS: 'Please enter the status',
  MIN_SALARY: 'Please enter a salary of zero or more',
  INVALID_JOB_POSTING_URL: 'Please enter a valid URL',
}

const router = useRouter()

const queryClient = useQueryClient()

const { mutate, isPending } = useMutation({
  mutationFn: createApplication,
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
  initialValues: {
    status: Status.InProgress,
  },
})

const dateApplied = computed({
  get: () => (form.values.dateApplied ? parseDate(form.values.dateApplied) : undefined),
  set: (value) => value,
})

const dateFormatter = new DateFormatter(navigator.language, { dateStyle: 'long' })

const handleSubmit = form.handleSubmit((values) =>
  mutate({
    ...values,
    dateApplied: new Date(values.dateApplied).toISOString(),
  }),
)
</script>

<template>
  <h1 class="text-xl font-semibold">New application</h1>
  <p class="text-sm">Stay on top of your job search by logging your application details</p>
  <Card class="mt-14">
    <CardContent>
      <p class="mb-4 text-sm text-slate-500">Track your journey to the next opportunity</p>
      <form class="flex flex-col gap-y-4 xl:max-w-3/4" novalidate @submit="handleSubmit">
        <div class="flex flex-col items-start gap-4 md:flex-row">
          <FormField name="companyName" v-slot="{ componentField }">
            <FormItem class="w-full md:w-1/2">
              <FormLabel
                ><span
                  >Company<span
                    :class="
                      cn(
                        'text-destructive',
                        form.errors.value.companyName && 'text-destructive-foreground',
                      )
                    "
                    >*</span
                  ></span
                ></FormLabel
              >
              <FormControl>
                <Input
                  class="placeholder:font-light"
                  type="text"
                  placeholder="e.g., Evil Corp Inc."
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="jobTitle" v-slot="{ componentField }">
            <FormItem class="w-full md:w-1/2">
              <FormLabel
                ><span
                  >Job title<span
                    :class="
                      cn(
                        'text-destructive',
                        form.errors.value.jobTitle && 'text-destructive-foreground',
                      )
                    "
                    >*</span
                  ></span
                ></FormLabel
              >
              <FormControl>
                <Input
                  class="placeholder:font-light"
                  type="text"
                  placeholder="e.g., Software Engineer"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex flex-col items-start gap-4 md:flex-row">
          <FormField name="dateApplied">
            <FormItem class="flex w-full flex-col md:w-1/2">
              <FormLabel
                ><span
                  >Date applied<span
                    :class="
                      cn(
                        'text-destructive',
                        form.errors.value.dateApplied && 'text-destructive-foreground',
                      )
                    "
                    >*</span
                  ></span
                ></FormLabel
              >
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      :class="
                        cn(
                          'justify-start bg-white !font-light hover:bg-white',
                          !dateApplied && 'text-slate-400 hover:text-slate-400',
                        )
                      "
                      variant="outline"
                    >
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
                  <Calendar
                    v-model="dateApplied"
                    calendarLabel="Date
                  applied"
                    initialFocus
                    :minValue="new CalendarDate(1900, 1, 1)"
                    :maxValue="today(getLocalTimeZone())"
                    @update:modelValue="
                      (value) =>
                        value
                          ? form.setFieldValue('dateApplied', value.toString())
                          : form.setFieldValue('dateApplied', undefined)
                    "
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="status" v-slot="{ componentField }">
            <FormItem class="w-full md:w-1/2">
              <FormLabel
                ><span
                  >Status<span
                    :class="
                      cn(
                        'text-destructive',
                        form.errors.value.status && 'text-destructive-foreground',
                      )
                    "
                    >*</span
                  ></span
                ></FormLabel
              >
              <Select v-bind="componentField">
                <FormControl>
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
        <div class="flex flex-col items-start gap-4 md:flex-row">
          <FormField name="minSalary" v-slot="{ componentField }">
            <FormItem class="w-full md:w-1/2">
              <FormLabel>Min salary</FormLabel>
              <FormControl>
                <Input
                  class="placeholder:font-light"
                  type="number"
                  min="0"
                  placeholder="$50,000"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="maxSalary" v-slot="{ componentField }">
            <FormItem class="w-full md:w-1/2">
              <FormLabel>Max salary</FormLabel>
              <FormControl>
                <Input
                  class="placeholder:font-light"
                  type="number"
                  min="0"
                  placeholder="$70,000"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <FormField name="jobPostingURL" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Job posting URL</FormLabel>
            <FormControl>
              <Input
                class="placeholder:font-light"
                type="text"
                placeholder="e.g., https://glassbore.com/jobs/swe420692137"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="notes" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                class="resize-none"
                placeholder="e.g., Follow up in two weeks"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="mt-2 flex flex-col-reverse flex-wrap gap-2 md:flex-row">
          <Button
            class="text-primary hover:text-primary w-full md:w-auto"
            type="button"
            variant="ghost"
            asChild
          >
            <RouterLink :to="ROUTES.APPLICATIONS.path">Cancel</RouterLink>
          </Button>
          <Button class="w-full md:w-auto" type="submit" :disabled="isPending">
            <Loader2 class="mr-2 size-4 animate-spin" v-if="isPending" />
            Submit
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
