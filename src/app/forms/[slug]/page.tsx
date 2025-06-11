import { Header, QRCodeDialog } from '@/app/dashboard/components'
import { CopyFormURLButton } from '@/app/forms/[slug]/components'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import getDb from '@/lib/db'
import { getCurrentSession } from '@/lib/session'
import type { Form, FormSubmission } from '@/lib/types/database.types'
import { formatSlug, getRatingColor, getRatingLabel } from '@/lib/utils'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ExternalLink,
  Home,
  MessageSquare,
  Star,
  Users,
} from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

function aggregateSubmissionRatings(
  submissions: Array<FormSubmission>,
  fields: Array<
    | 'topic'
    | 'expertise'
    | 'discussion'
    | 'panelists'
    | 'presentation'
    | 'slides'
    | 'materials'
    | 'interaction'
  >
) {
  const result = fields.map((field) => {
    const { sum, count } = submissions.reduce(
      (acc, submission) => {
        const value = submission[field as keyof FormSubmission] as number | null
        if (typeof value === 'number') {
          acc.sum += value
          acc.count += 1
        }

        return acc
      },
      { sum: 0, count: 0 }
    )

    return {
      type: field.charAt(0).toUpperCase() + field.slice(1),
      avg: Math.round(count > 0 ? (sum / count) * 10 : 0) / 10,
    }
  })

  return result
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { session } = await getCurrentSession()

  if (!session) {
    redirect('/login')
  }

  const { slug } = await params

  const db = await getDb()

  const [form]: Array<Form> = await db`
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
    WHERE forms.slug = ${slug}
  `

  if (!form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Feedback Form Not Found
            </CardTitle>
            <CardDescription className="text-slate-600">
              The feedback form you&apos;re looking for doesn&apos;t exist or may have been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 pt-4">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const responses: Array<FormSubmission> = await db`
    SELECT * FROM form_submissions
    WHERE form_id = ${form.id}
  `

  let feedbackRatings: Array<{ type: string; avg: number }> = []

  switch (form.type) {
    case 'panel':
      feedbackRatings = aggregateSubmissionRatings(responses, [
        'topic',
        'expertise',
        'discussion',
        'panelists',
      ])
      break
    case 'talk':
      feedbackRatings = aggregateSubmissionRatings(responses, [
        'topic',
        'expertise',
        'presentation',
        'slides',
      ])
      break
    case 'workshop':
      feedbackRatings = aggregateSubmissionRatings(responses, [
        'topic',
        'expertise',
        'materials',
        'interaction',
      ])
      break
  }

  const feedbackTypesPerFormType = {
    panel: ['topic', 'expertise', 'discussion', 'panelists'] as unknown as [keyof FormSubmission],
    talk: ['topic', 'expertise', 'presentation', 'slides'] as unknown as [keyof FormSubmission],
    workshop: ['topic', 'expertise', 'materials', 'interaction'] as unknown as [
      keyof FormSubmission,
    ],
  }

  const readonlyHeaders = await headers()
  const formURL = `${
    readonlyHeaders.get('x-forwarded-proto') || 'http'
  }://${readonlyHeaders.get('host')}/feedback/${form.slug}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="font-mono text-sm text-gray-500">Code: {formatSlug(form.slug)}</div>
                <Badge variant={'default'}>
                  {form.type.charAt(0).toUpperCase() + form.type.slice(1)}
                </Badge>
                <Badge variant={form.is_active ? 'green' : 'secondary'}>
                  {form.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {form.description && <p className="mt-2 text-gray-600">{form.description}</p>}
              {form.event_id && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{form.event_name}</span>
                  {form.event_date && (
                    <span className="text-gray-400">
                      • {new Date(form.event_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <QRCodeDialog url={formURL} title={form.title} />
              <CopyFormURLButton url={formURL} />
              <Button asChild>
                <a href={formURL} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Form
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{responses.length}</div>
                  <div className="text-sm text-gray-500">Total Responses</div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Average Ratings</h4>

                  <div className="space-y-2">
                    {feedbackRatings.map(({ type, avg }) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm">{type}</span>
                        <div className="flex items-center gap-2">
                          <Star className={`h-4 w-4 ${getRatingColor(avg)}`} />
                          <span className="font-medium">{avg || '-'}</span>
                          <span className="text-xs text-gray-500">{getRatingLabel(avg)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Responses ({responses.length})
                </CardTitle>
                <CardDescription>Individual feedback submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {responses.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>No responses yet.</p>
                    <p className="text-sm">Share your form to start collecting feedback.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {responses.map((response, index: number) => (
                      <div key={response.id} className="rounded-lg border bg-white p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <div className="font-medium">
                              {response.username ||
                                response.email ||
                                `Response #${responses.length - index}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(response.created_at).toLocaleDateString()} at{' '}
                              {new Date(response.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                          {response.may_publish && (
                            <Badge variant="outline" className="text-xs">
                              May Publish
                            </Badge>
                          )}
                        </div>

                        {/* Ratings */}
                        <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                          {feedbackTypesPerFormType[form.type].map((field) => (
                            <div key={field} className="text-center">
                              <div className="text-xs text-gray-500">
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                              </div>
                              <div className="font-medium">{response[field] || '—'}</div>
                            </div>
                          ))}
                        </div>

                        {response.comment && (
                          <div className="mb-3">
                            <div className="mb-1 text-xs text-gray-500">Comments</div>
                            <div className="rounded bg-gray-50 p-2 text-sm">{response.comment}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
