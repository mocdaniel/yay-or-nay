import z from 'zod'

export const SPECIAL_CHAR = (value: string) =>
  /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/.test(value)
export const LOWERCASE = (value: string) => /[a-z]/.test(value)
export const UPPERCASE = (value: string) => /[A-Z]/.test(value)

export const credentialsSchema = z.object({
  username: z.string().min(4).max(32),
  password: z
    .string()
    .min(8)
    .refine(SPECIAL_CHAR, 'Password must contain special characters')
    .refine(LOWERCASE, 'Password must contain uppercase characters')
    .refine(UPPERCASE, 'Password must contain lowercase characters'),
})

export const eventSchema = z.object({
  title: z.string().min(4).max(128),
  description: z.string().max(512).optional(),
  date: z.string().date().optional(),
  location: z.string().max(256).optional(),
})

export const formSchema = z.object({
  title: z.string().min(4).max(128),
  description: z.string().max(512).optional(),
  type: z.enum(['talk', 'workshop', 'panel']),
  eventId: z
    .string()
    .optional()
    .refine((id) => {
      if (!id) return true
      const intId = parseInt(id, 10)

      return intId > 0 && !isNaN(intId)
    }),
  slug: z
    .string()
    .regex(/^[a-zA-Z0-9]{8}$/, 'Slug must be exactly 8 alphanumeric characters')
    .optional()
    .or(z.string().length(0)), // weird stuff needed for shadcn components/zod/useActionState to work
})

const feedbackFormPartial = {
  formId: z.number().int().min(1),
  formType: z.enum(['talk', 'workshop', 'panel']),
  topic: z.string().regex(/^[1-5]$/, 'Rating must be between 1 and 5'),
  expertise: z.string().regex(/^[1-5]$/, 'Rating must be between 1 and 5'),
  username: z.string().min(2).max(128).optional().or(z.string().length(0)),
  email: z.string().email().optional().or(z.string().length(0)),
  comment: z.string().min(4).max(1028).optional().or(z.string().length(0)),
  mayPublish: z.boolean(),
}

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export const talkFeedbackSchema = z.object({
  presentation: z.string().regex(/^[1-5]$/, 'Rating must be between 1 and 5'),
  slides: z.string().regex(/^[1-5]$/, 'Rating must be between 1 and 5'),
  ...feedbackFormPartial,
})

export const workshopFeedbackSchema = z.object({
  materials: z.string().regex(/^[1-5]$/, 'Rating must be between 1 and 5'),
  interaction: z.string().regex(/^[1-5]$/, 'Rating must be between 1 and 5'),
  ...feedbackFormPartial,
})

export const panelFeedbackSchema = z.object({
  discussion: z.string().regex(/^[1-5]$/, 'Rating must be between 1 and 5'),
  panelists: z.string().regex(/^[1-5]$/, 'Rating must be between 1 and 5'),
  ...feedbackFormPartial,
})
