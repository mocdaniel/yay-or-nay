import { LogoutForm } from '@/app/dashboard/components'
import { getCurrentSession } from '@/lib/session'
import { LayoutDashboard, LogIn } from 'lucide-react'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'

export async function Header({ showDashboardLink = false }: { showDashboardLink?: boolean }) {
  const { session } = await getCurrentSession()

  let isLoggedIn = false

  if (session) {
    isLoggedIn = true
  }

  return (
    <div className="h-18 border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="space-2 flex items-center">
            <NextImage src="/favicon.ico" alt="Logo" height={64} width={64} />
            <h1 className="text-xl font-semibold">Yay or Nay</h1>
          </div>
          <div className="space-around flex gap-2">
            {showDashboardLink && isLoggedIn && (
              <Button variant="outline" type="button" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard /> Dashboard
                </Link>
              </Button>
            )}
            {isLoggedIn ? (
              <LogoutForm />
            ) : (
              <Button variant="outline" type="button" asChild>
                <Link href="/login">
                  <LogIn /> Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
