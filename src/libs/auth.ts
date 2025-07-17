// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import type { NextAuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import { JWT } from 'next-auth/jwt'

const prisma = new PrismaClient()

// Generate a random secret if not in production
const generateSecret = () => {
  if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is not set in production')
  }
  return process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
}

export const authOptions: NextAuthOptions = {
  secret: generateSecret(),
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma) as Adapter,

  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        // For demo purposes, we'll use hardcoded credentials
        if (credentials.email === 'admin@vuexy.com' && credentials.password === 'admin') {
          // Check if user exists in the database
          let user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          // If user doesn't exist, create one
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: 'Admin',
                emailVerified: new Date()
              }
            })
          }


          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: 'admin' // Add role for authorization
          }
        }

        // If credentials are invalid
        throw new Error('Invalid email or password')
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })

    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    // * While using `jwt` as a strategy, `jwt()` callback will be called before
    // * the `session()` callback. So we have to add custom parameters in `token`
    // * via `jwt()` callback to make them accessible in the `session()` callback
    async jwt({ token, user }) {
      // * `user` is available only when the user is signing in
      if (user) {
        // * This will be passed to the `session` callback
        token.role = (user as any).role || 'user'
        token.id = user.id
      }

      return token
    },
    async session({ session, token }) {
      // * Add role value to user object so it is passed to client
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }

      return session
    }
  }
}
