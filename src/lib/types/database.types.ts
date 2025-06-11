export interface Event {
  id: number
  name: string
  description?: string
  date?: string
  location?: string
  created_at: string
  updated_at: string
}

export interface Form {
  id: number
  title: string
  description?: string
  type: 'talk' | 'workshop' | 'panel'
  is_active: boolean
  slug: string
  event_id?: number
  event_date?: string
  event_name?: string
  created_at: string
  updated_at: string
}

export interface FormSubmission {
  id: number
  form_id: number
  username: string | null
  email: string | null
  comment: string | null
  topic: number
  expertise: number
  presentation: number | null
  slides: number | null
  materials: number | null
  interaction: number | null
  discussion: number | null
  panelists: number | null
  may_publish: boolean
  created_at: string
}
