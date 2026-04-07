import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export const proxy = createMiddleware(routing)

export const config = {
  matcher: [
    // Match all pathnames except static files, internal Next.js routes, and API routes
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
}
