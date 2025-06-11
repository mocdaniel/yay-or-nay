'use server'

import { createUser } from '@/lib/auth'
import { createSession, generateSessionToken } from '@/lib/session'
import { credentialsSchema } from '@/lib/zod-schemas'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type ActionResult = {
  message?: string
}

export async function signupAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const validatedFormData = credentialsSchema.safeParse(Object.fromEntries(formData))

  if (!validatedFormData.success) {
    return { message: validatedFormData.error.message }
  }

  const user = await createUser(validatedFormData.data.username, validatedFormData.data.password)

  if (!user) {
    return { message: 'Admin user already exists. Please log in as this user.' }
  }

  // Create session and set cookie
  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id)

  const cookieStore = await cookies()
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: session.expiresAt,
    path: '/',
  })

  return redirect('/dashboard')
}
