<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { FormField, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import Input from '@/components/ui/input/Input.vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import FormMessage from '@/components/ui/form/FormMessage.vue'
import { Card, CardContent } from '@/components/ui/card'
import { MIN_PASSWORD_LENGTH } from '@/modules/auth'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import { useTitle } from '@vueuse/core'

useTitle('CareerCompass - Sign up')

const validationSchema = toTypedSchema(
  z
    .object({
      firstName: z.string({ required_error: 'Please enter your first name' }),
      lastName: z.string({ required_error: 'Please enter your last name' }),
      email: z
        .string({ required_error: 'Please enter your email' })
        .email('Please enter a valid email'),
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
  <AuthLayout title="Sign up to CareerCompass">
    <Card>
      <CardContent>
        <form class="flex flex-col gap-y-4" @submit="handleSubmit">
          <div class="flex gap-x-4">
            <FormField name="firstName" v-slot="{ componentField }">
              <FormItem class="w-full">
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your first name" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="lastName" v-slot="{ componentField }">
              <FormItem class="w-full">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your last name" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <FormField name="email" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
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
          <Button type="submit">Sign up</Button>
          <p class="text-center text-sm text-slate-500">
            Already have an account?
            <RouterLink class="text-foreground font-semibold hover:underline" to="/sign-in"
              >Sign in</RouterLink
            >
          </p>
        </form>
      </CardContent>
    </Card>
  </AuthLayout>
</template>
