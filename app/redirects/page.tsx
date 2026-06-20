import { cookies } from 'next/headers'
import { Navbar } from '../components/nav'
import { AnimatedHeading } from '../components/animated-heading'
import { verifyRedirectsAdminSessionToken, REDIRECTS_ADMIN_COOKIE } from 'lib/redirects-admin-session'
import { createServiceRoleSupabase } from 'lib/supabase'
import { RedirectsClient } from './redirects-client'

export const dynamic = 'force-dynamic'

export type RedirectRow = { slug: string; url: string; created_at: string }

async function fetchRedirects(): Promise<RedirectRow[]> {
  const supabase = createServiceRoleSupabase()
  if (!supabase) return []
  const { data } = await supabase
    .from('redirects')
    .select('slug, url, created_at')
    .order('created_at', { ascending: false })
  return (data ?? []) as RedirectRow[]
}

export default async function RedirectsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(REDIRECTS_ADMIN_COOKIE)?.value
  const initialAuthenticated = verifyRedirectsAdminSessionToken(token)
  const redirects = initialAuthenticated ? await fetchRedirects() : []

  return (
    <div className="relative min-h-[100dvh] w-full pb-16">
      <Navbar variant="floating" />
      <div className="title-spacing px-0 pt-8">
        <AnimatedHeading className="font-semibold text-2xl tracking-tighter lowercase">
          redirects
        </AnimatedHeading>
        <p className="text-[var(--color-dark)] lowercase dark:text-[var(--color-light)]">
          manage short links on avansear.com.
        </p>
      </div>
      <RedirectsClient initialAuthenticated={initialAuthenticated} initialRedirects={redirects} />
    </div>
  )
}
