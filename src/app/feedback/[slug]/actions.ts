'use server'

import getDb from '@/lib/db'
import { panelFeedbackSchema, talkFeedbackSchema, workshopFeedbackSchema } from '@/lib/zod-schemas'

export async function submitFeedbackAction(
  _prev: { success?: true; error: undefined | string },
  formData: FormData
): Promise<{ success?: true; error: undefined | string }> {
  // We build a FormData object containing all possible fields for all feedback form types before validation
  const expandedFormData = {
    formId: parseInt(formData.get('formId') as string, 10),
    formType: formData.get('formType'),
    topic: formData.get('topic'),
    expertise: formData.get('expertise'),
    mayPublish: formData.get('mayPublish') === 'on',
    // everything below is optional or has defaults, so we can default back to undefined for Zod's sake
    username: formData.get('username') || undefined,
    email: formData.get('email') || undefined,
    comment: formData.get('comment') || undefined,
    presentation: formData.get('presentation') || undefined,
    slides: formData.get('slides') || undefined,
    materials: formData.get('materials') || undefined,
    interaction: formData.get('interaction') || undefined,
    discussion: formData.get('discussion') || undefined,
    panelists: formData.get('panelists') || undefined,
  }

  const formSchema =
    expandedFormData.formType === 'talk'
      ? talkFeedbackSchema
      : expandedFormData.formType === 'workshop'
        ? workshopFeedbackSchema
        : panelFeedbackSchema

  const validatedFormData = formSchema.safeParse(expandedFormData)

  if (!validatedFormData.success) {
    return {
      error: validatedFormData.error.message,
    }
  }

  const db = await getDb()

  const {
    formId,
    username,
    email,
    comment,
    topic,
    expertise,
    mayPublish,
    // The following fields may not exist on all types, so we use type narrowing below
  } = validatedFormData.data

  // Type narrowing for optional fields
  const presentation =
    'presentation' in validatedFormData.data ? validatedFormData.data.presentation : undefined
  const slides = 'slides' in validatedFormData.data ? validatedFormData.data.slides : undefined
  const materials =
    'materials' in validatedFormData.data ? validatedFormData.data.materials : undefined
  const interaction =
    'interaction' in validatedFormData.data ? validatedFormData.data.interaction : undefined
  const discussion =
    'discussion' in validatedFormData.data ? validatedFormData.data.discussion : undefined
  const panelists =
    'panelists' in validatedFormData.data ? validatedFormData.data.panelists : undefined

  const [row] = await db`
    INSERT INTO form_submissions
    (form_id, username, email, comment, topic, expertise, presentation, slides, materials, interaction, discussion, panelists, may_publish)
    VALUES (
      ${formId},
      ${username || null},
      ${email || null},
      ${comment || null},
      ${topic},
      ${expertise},
      ${presentation ? parseInt(presentation, 10) : null},
      ${slides ? parseInt(slides, 10) : null},
      ${materials ? parseInt(materials, 10) : null},
      ${interaction ? parseInt(interaction, 10) : null},
      ${discussion ? parseInt(discussion, 10) : null},
      ${panelists ? parseInt(panelists, 10) : null},
      ${mayPublish}
    )
    RETURNING *
  `

  if (!row) return { error: 'Could not create feedback. Please try again!' }

  return { success: true, error: undefined }
}
