'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
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
          <div className="text-sm text-slate-500">
            <p>This could happen if:</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• The form link is incorrect or expired</li>
              <li>• The form has been deleted by the creator</li>
              <li>• You don&apos;t have permission to access this form</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-slate-400">
              Need help? Contact the form creator or check if you have the correct link.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
