<script setup lang="ts">
import { ROUTES } from '@/router'
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
import { MIN_PASSWORD_LENGTH } from '@/modules/auth'

useTitle('CareerCompass - Reset password')

const validationSchema = toTypedSchema(
  z
    .object({
      password: z
        .string({ required_error: 'Please enter your password' })
        .min(
          MIN_PASSWORD_LENGTH,
          `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
        ),
      confirmPassword: z
        .string({ required_error: 'Please confirm your password' })
        .min(
          MIN_PASSWORD_LENGTH,
          `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
        ),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      path: ['confirmPassword'],
      message: "Passwords don't match",
    }),
)

const form = useForm({ validationSchema })

const handleSubmit = form.handleSubmit((values) => {
  console.log('values', values)
})
</script>

<template>
  <AuthLayout title="Create a new password" subtitle="Set a new password to regain your account">
    <Card>
      <CardContent>
        <form class="flex flex-col gap-y-4" @submit="handleSubmit">
          <FormField name="password" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="confirmPassword" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit">Submit</Button>
          <RouterLink
            class="text-foreground flex items-center gap-x-0.5 text-sm font-semibold hover:underline"
            :to="ROUTES.SIGN_IN.path"
          >
            <ArrowLeft class="size-4" /> Back to sign in
          </RouterLink>
        </form>
      </CardContent>
    </Card>
  </AuthLayout>
</template>
