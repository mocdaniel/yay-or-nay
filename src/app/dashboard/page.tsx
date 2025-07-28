import {
  CreateEventDialog,
  CreateFormDialog,
  FormActions,
  FormSwitch,
} from '@/app/dashboard/components'
import { Header } from '@/components/header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import getDb from '@/lib/db'
import { getCurrentSession } from '@/lib/session'
import type { Event, Form } from '@/lib/types/database.types'
import { formatSlug } from '@/lib/utils'
import { Calendar, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const { session } = await getCurrentSession()

  if (!session) {
    redirect('/login')
  }

  const db = await getDb()
  const events: Event[] = await db`
    SELECT
      id,
      name,
      description,
      date,
      location,
      created_at
    FROM events
  `

  const forms: Form[] = await db`
    SELECT
      forms.id,
      forms.title,
      forms.description,
      forms.slug,
      forms.form_type AS type,
      forms.is_active,
      forms.created_at,
      events.id AS event_id,
      events.date AS event_date,
      events.name AS event_name
    FROM forms
    LEFT JOIN events ON forms.event_id = events.id
  `

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your feedback forms and events</p>
        </div>

        <div className="mb-8 flex gap-4">
          <CreateFormDialog events={events} />
          <CreateEventDialog />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Feedback Forms */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Feedback Forms ({forms.length})</h2>
            <div className="space-y-4">
              {forms.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No feedback forms created yet.</p>
                      <p className="text-sm">Create your first form to get started.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                forms.map((form) => (
                  <Card key={form.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg hover:cursor-pointer hover:underline">
                            <Link href={`/forms/${form.slug}`}>{form.title}</Link>
                          </CardTitle>
                          <div className="font-mono text-sm text-gray-500">
                            Code: {formatSlug(form.slug)}
                          </div>
                          {form.description && (
                            <CardDescription className="mt-1">{form.description}</CardDescription>
                          )}
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <Badge variant={'secondary'}>
                            {form.type.charAt(0).toUpperCase() + form.type.slice(1)}
                          </Badge>
                          <Badge variant={form.is_active ? 'green' : 'secondary'}>
                            {form.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {form.event_id && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{form.event_name}</span>
                            {form.event_date && (
                              <span className="text-gray-400">
                                • {new Date(form.event_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Form Status:</span>
                            <FormSwitch formId={form.id} isActive={form.is_active} />
                            <span className="text-sm text-gray-600">
                              {form.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          <FormActions form={form} />
                        </div>

                        <div className="text-xs text-gray-500">
                          Created: {new Date(form.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Events */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Events ({events.length})</h2>
            <div className="space-y-4">
              {events.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500">
                      <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No events created yet.</p>
                      <p className="text-sm">Create events to organize your feedback forms.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      {event.description && <CardDescription>{event.description}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {event.date && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="text-sm text-gray-600">📍 {event.location}</div>
                        )}
                        <div className="text-xs text-gray-500">
                          Created: {new Date(event.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
