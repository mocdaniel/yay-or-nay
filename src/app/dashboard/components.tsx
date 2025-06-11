'use client'

import {
  createEventAction,
  createFormAction,
  logoutAction,
  toggleFormActive,
} from '@/app/dashboard/actions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { Event, Form as FormType } from '@/lib/types/database.types'
import { eventSchema, formSchema } from '@/lib/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  Copy,
  Download,
  ExternalLink,
  LogOut,
  MoreHorizontal,
  PlusCircle,
  QrCode,
} from 'lucide-react'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type z from 'zod'

interface CreateFormDialogProps {
  events: Event[]
}

export function CreateEventDialog() {
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: undefined,
      date: undefined,
      location: undefined,
    },
  })

  const [state, formAction, isPending] = useActionState(createEventAction, {
    error: undefined,
    event: undefined,
  })

  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (state.event) {
      setOpen(false)
      toast.success('Event created successfully!')
      router.refresh()
    }
  }, [router, setOpen, state.event])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>Create a new event to link feedback forms to.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction}>
            <div className="grid gap-4 py-4">
              {state.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., DockerCon 2025" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optional description of the event"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="YYYY-MM-DD"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g., San Francisco, CA"
                        {...field}
                        value={undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !form.formState.isValid}>
                {isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function CreateFormDialog({ events }: CreateFormDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: undefined,
      type: 'talk',
      eventId: '',
      slug: '',
    },
  })

  const [state, formAction, isPending] = useActionState(createFormAction, {
    error: undefined,
    form: undefined,
  })

  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (state.form) {
      setOpen(false)
      toast.success('Form created successfully!')
      router.refresh()
    }
  }, [router, setOpen, state.form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Form
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Feedback Form</DialogTitle>
          <DialogDescription>Create a new feedback form for talks or workshops.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction}>
            <div className="grid gap-4 py-4">
              {state.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g., React Best Practices Talk"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormDescription>
                      <b>Required.</b> Must be at least 4 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optional description of the feedback form"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      <b>Optional.</b> This will be shown to visitors.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <input hidden {...field} />
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value: 'talk' | 'workshop' | 'panel') =>
                          field.onChange(value)
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select form type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="talk">Talk</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="panel">Panel</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventId"
                render={({ field }) => (
                  <FormItem>
                    <input hidden {...field} />
                    <FormLabel>Event</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select an event" />
                        </SelectTrigger>
                        <SelectContent>
                          {events.map((event) => (
                            <SelectItem key={event.id} value={event.id.toString()}>
                              {event.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      <b>Optional.</b> Link this form to an event for more context.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Code</FormLabel>
                    <FormControl>
                      <Input className="w-48" {...field} placeholder="e.g., ABCD1234" />
                    </FormControl>
                    <FormDescription>
                      <b>Optional.</b> Provide an easy-to-remember, 8-character code. If left blank,
                      a random code will be generated.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !form.formState.isValid}>
                {isPending ? 'Creating...' : 'Create Form'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function FormActions({ form }: { form: FormType }) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [formUrl, setFormUrl] = useState('')

  useEffect(() => {
    setFormUrl(`${window.location.origin}/feedback/${form.slug}`)
  }, [form.slug])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formUrl)
    toast.success('Form link copied to clipboard')
  }

  const openForm = () => {
    window.open(formUrl, '_blank')
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <QRCodeDialog url={formUrl} title={form.title} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/forms/${form.slug}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowShareDialog(true)}>Share Form</DropdownMenuItem>
            <DropdownMenuItem onClick={openForm}>View Form</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Form</DialogTitle>
            <DialogDescription>
              Share this link with your audience to collect feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input readOnly value={formUrl} onClick={(e) => e.currentTarget.select()} />
            </div>
            <Button type="button" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
            <Button onClick={openForm}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Form
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function FormSwitch({ formId, isActive }: { formId: number; isActive: boolean }) {
  const [toggleSuccess, setToggleSuccess] = useState<undefined | boolean>(undefined)
  const router = useRouter()

  useEffect(() => {
    if (toggleSuccess) {
      toast.success('Form activated successfully!')
    } else if (toggleSuccess === false) {
      toast.success('Form deactivated successfully!')
    }
  }, [toggleSuccess])

  async function handleToggleActive(formId: number, checked: boolean) {
    setToggleSuccess(checked)
    const { error } = await toggleFormActive(formId, checked)
    if (error) {
      toast.error(`Failed to ${checked ? 'activate' : 'deactivate'} form: ${error}`)
      setToggleSuccess(!checked)
      return
    }
    router.refresh()
  }

  return (
    <Switch
      checked={isActive}
      onCheckedChange={(checked) => handleToggleActive(formId, checked)}
      className="cursor-pointer"
    />
  )
}

export function Header() {
  const [_state, formAction, isPending] = useActionState(logoutAction, undefined)

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="space-2 flex items-center">
            <NextImage src="/favicon.ico" alt="Logo" height={64} width={64} />
            <h1 className="text-xl font-semibold">Yay or Nay</h1>
          </div>
          <form action={formAction}>
            <Button variant="outline" type="submit" disabled={isPending}>
              <LogOut /> Logout
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export function QRCodeDialog({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQRCode = () => {
    if (!qrRef.current) return

    // Create a canvas element
    const canvas = document.createElement('canvas')
    const svgElement = qrRef.current.querySelector('svg')

    if (!svgElement) return

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const img = new Image()

    img.onload = () => {
      // Set canvas dimensions to match the QR code with some padding
      canvas.width = img.width + 40
      canvas.height = img.height + 40

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Fill with white background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw the QR code in the center
      ctx.drawImage(img, 20, 20)

      // Create download link
      const link = document.createElement('a')
      link.download = `feedback-form-qr-${title.replace(/\s+/g, '-').toLowerCase()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

      toast.success('The QR code has been downloaded as PNG image.')
    }

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  const copyQRCodeUrl = () => {
    navigator.clipboard.writeText(url)
    toast.success('The feedback form URL has been copied to clipboard.')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCode className="mr-2 h-4 w-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Feedback Form QR Code</DialogTitle>
          <DialogDescription>
            Share this QR code with your audience to collect feedback for &quot;{title}&quot;.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center rounded-md bg-white p-4">
          <div ref={qrRef} className="rounded-md border bg-white p-4">
            <QRCodeSVG value={url} size={200} level="H" />
          </div>
          <p className="mt-4 max-w-[200px] truncate text-center text-xs text-gray-500">{url}</p>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={copyQRCodeUrl}>
            <Copy className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
          <Button onClick={downloadQRCode}>
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
