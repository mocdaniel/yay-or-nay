'use client'

import { signupAction } from '@/app/signup/actions'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { credentialsSchema, LOWERCASE, SPECIAL_CHAR, UPPERCASE } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

export default function SignupForm() {
  const form = useForm<z.infer<typeof credentialsSchema>>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const [state, formAction, isPending] = useActionState(signupAction, {})

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription className="ml-2">
                <div className="flex justify-start gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${
                      form.watch(field.name).length >= 4 ? 'stroke-green-500' : ''
                    }`}
                  />
                  Min. 4 characters
                </div>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormDescription className="ml-2">
                <div className="flex justify-start gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${
                      form.watch(field.name).length >= 8 ? 'stroke-green-500' : ''
                    }`}
                  />
                  Min. 8 characters
                </div>
                <div className="flex justify-start gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${
                      LOWERCASE(form.watch(field.name)) ? 'stroke-green-500' : ''
                    }`}
                  />
                  Lowercase characters
                </div>
                <div className="flex justify-start gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${
                      UPPERCASE(form.watch(field.name)) ? 'stroke-green-500' : ''
                    }`}
                  />
                  Uppercase characters
                </div>
                <div className="flex justify-start gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${
                      SPECIAL_CHAR(form.watch(field.name)) ? 'stroke-green-500' : ''
                    }`}
                  />
                  Special characters
                </div>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {state.message && <div className="text-destructive">{state.message}</div>}
        <Button type="submit" className="w-full" disabled={isPending || !form.formState.isValid}>
          Sign Up
        </Button>
        <div className="flex w-full justify-center">
          <Link href="/login" className="text-muted-foreground underline">
            Login instead
          </Link>
        </div>
      </form>
    </Form>
  )
}
