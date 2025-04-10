<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { FormField, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import Input from '@/components/ui/input/Input.vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import FormMessage from '@/components/ui/form/FormMessage.vue'
import { Card, CardContent } from '@/components/ui/card'
import signInImage from '@/assets/sign-in.svg'
import { Compass } from 'lucide-vue-next'

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const handleSubmit = form.handleSubmit((values) => {
  console.log('values', values)
})
</script>

<template>
  <div class="flex">
    <div
      class="flex h-screen w-full flex-col items-center justify-between gap-y-4 lg:w-1/2 xl:w-3/5"
    >
      <div class="mt-4 ml-4 flex items-center gap-x-2 self-start lg:mt-6 lg:ml-6">
        <Compass />
        <span class="text-lg font-semibold">CareerCompass</span>
      </div>
      <div class="flex w-11/12 max-w-sm flex-col gap-y-4 xl:max-w-md">
        <div class="text-center">
          <h1 class="text-xl font-semibold">Sign in to CareerCompass</h1>
          <p>Your journey to career success starts here</p>
        </div>
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
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <RouterLink
                class="ml-auto text-sm font-semibold hover:underline"
                to="/forgot-password"
                >Forgot password?
              </RouterLink>
              <Button type="submit"> Sign in </Button>
              <p class="text-center text-sm text-slate-500">
                Don’t have an account?
                <RouterLink class="text-foreground font-semibold hover:underline" to="/sign-up"
                  >Sign up</RouterLink
                >
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
      <p class="px-4 pb-4 text-center text-xs text-slate-500 lg:px-6 lg:pb-6">
        Your next opportunity is just a step away. Let's chart the path together.
      </p>
    </div>
    <div
      class="bg-primary hidden flex-col items-center justify-center gap-y-4 lg:flex lg:w-1/2 xl:w-2/5"
    >
      <img class="w-11/12" :src="signInImage" />
      <div class="text-center">
        <p class="text-lg font-semibold text-white 2xl:text-xl">Track. Organize. Achieve.</p>
        <p class="text-sm font-light text-white 2xl:text-base">
          Stay on top of your job applications and reach your goals with ease!
        </p>
      </div>
    </div>
  </div>
</template>
