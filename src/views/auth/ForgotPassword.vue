<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { FormField, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import Input from '@/components/ui/input/Input.vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import FormMessage from '@/components/ui/form/FormMessage.vue'
import { Card, CardContent } from '@/components/ui/card'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import { useTitle } from '@vueuse/core'
import { ArrowLeft } from 'lucide-vue-next'

useTitle('CareerCompass - Forgot password')

const validationSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: 'Please enter your email' })
      .email('Please enter a valid email'),
  }),
)

const form = useForm({ validationSchema })

const handleSubmit = form.handleSubmit((values) => {
  console.log('values', values)
})
</script>

<template>
  <AuthLayout
    title="Reset your password"
    subtitle="Enter your email to receive a password reset link"
  >
    <Card>
      <CardContent>
        <form class="flex flex-col gap-y-4" @submit="handleSubmit">
          <FormField name="email" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit">Send</Button>
          <RouterLink
            class="text-foreground flex items-center gap-x-2 text-sm font-semibold hover:underline"
            to="/sign-in"
          >
            <ArrowLeft class="size-4" /> Back to sign in
          </RouterLink>
        </form>
      </CardContent>
    </Card>
  </AuthLayout>
</template>
