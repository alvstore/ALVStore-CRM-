// Third-party Imports
import { getServerSession } from 'next-auth'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

// Config Imports
import { authOptions } from '@/libs/auth'

// Debug function to log session info
function logSession(session: any) {
  console.log('=== AuthGuard Session ===')
  console.log('Session exists:', !!session)
  if (session) {
    console.log('User:', session.user?.email)
    console.log('Expires:', session.expires)
  }
  console.log('=========================')
}

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const session = await getServerSession(authOptions)
  logSession(session)

  // Add a check for the login page to prevent redirect loops
  const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/login')
  
  if (isLoginPage) {
    return <>{children}</>
  }

  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
