'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface RoleBasedRouteProps {
  children: ReactNode
  requiredRoles?: string[]
  redirectTo?: string
}

/**
 * Component to protect routes based on user roles
 * @param {ReactNode} children - The child components to render if user has required role
 * @param {string[]} requiredRoles - Array of roles that are allowed to access the route
 * @param {string} redirectTo - Path to redirect to if user doesn't have required role
 */
export default function RoleBasedRoute({
  children,
  requiredRoles = [],
  redirectTo = '/unauthorized',
}: RoleBasedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    // If no session exists, redirect to login
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    // If no roles are required, allow access
    if (requiredRoles.length === 0) return

    // Check if user has any of the required roles
    const userRole = session.user?.role
    const hasRequiredRole = requiredRoles.some(role => role === userRole)

    // Redirect if user doesn't have required role
    if (!hasRequiredRole) {
      router.push(redirectTo)
    }
  }, [session, status, requiredRoles, router, redirectTo])

  // Show loading spinner while checking auth status
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  // If no session exists, don't render anything (will be redirected by useEffect)
  if (!session) {
    return null
  }

  // Check if user has required role if any roles are specified
  if (requiredRoles.length > 0) {
    const userRole = session.user?.role
    const hasRequiredRole = requiredRoles.some(role => role === userRole)
    
    if (!hasRequiredRole) {
      return null
    }
  }

  // Render children if all checks pass
  return <>{children}</>
}

// Extend the Session interface to include the role
// This matches the auth.ts configuration
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }

  interface User {
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
}
