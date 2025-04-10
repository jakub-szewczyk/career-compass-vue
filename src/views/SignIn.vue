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
    <div class="flex h-screen w-full flex-col items-center justify-center lg:w-1/2 xl:w-3/5">
      <div class="absolute top-4 left-4 flex items-center gap-x-2 lg:top-6 lg:left-6">
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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    <div class="bg-primary hidden items-center justify-center lg:flex lg:w-1/2 xl:w-2/5">
      <img class="w-11/12" :src="signInImage" />
    </div>
  </div>
</template>
