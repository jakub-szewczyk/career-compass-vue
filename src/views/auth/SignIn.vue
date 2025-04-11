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

const validationSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: 'Please enter your email' })
      .email('Please enter a valid email'),
    password: z
      .string({ required_error: 'Please enter your password' })
      .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`),
  }),
)

const form = useForm({ validationSchema })

const handleSubmit = form.handleSubmit((values) => {
  console.log('values', values)
})
</script>

<template>
  <AuthLayout title="Sign in to CareerCompass">
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
          <FormField name="password" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <RouterLink class="ml-auto text-sm font-semibold hover:underline" to="/forgot-password">Forgot password?
          </RouterLink>
          <Button type="submit"> Sign in </Button>
          <p class="text-center text-sm text-slate-500">
            Don’t have an account?
            <RouterLink class="text-foreground font-semibold hover:underline" to="/sign-up">Sign up</RouterLink>
          </p>
        </form>
      </CardContent>
    </Card>
  </AuthLayout>
</template>
