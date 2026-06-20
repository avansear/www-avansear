import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyRedirectsAdminSessionToken, REDIRECTS_ADMIN_COOKIE } from 'lib/redirects-admin-session'
import { createServiceRoleSupabase } from 'lib/travelogue-markers'

const SLUG_RE = /^[a-z0-9]+(?:[-][a-z0-9]+)*$/

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(REDIRECTS_ADMIN_COOKIE)?.value
  if (!verifyRedirectsAdminSessionToken(token)) {
    return NextResponse.json({ ok: false, error: 'unauthorized.' }, { status: 401 })
  }

  let body: { slug?: string; url?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON.' }, { status: 400 })
  }

  const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : ''
  const url = typeof body.url === 'string' ? body.url.trim() : ''

  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ ok: false, error: 'slug must be lowercase letters, numbers, and hyphens only.' }, { status: 422 })
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') throw new Error()
  } catch {
    return NextResponse.json({ ok: false, error: 'url must be a valid http or https URL.' }, { status: 422 })
  }

  const supabase = createServiceRoleSupabase()
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'supabase is not configured.' }, { status: 503 })
  }

  const { error } = await supabase.from('redirects').insert({ slug, url: parsedUrl.toString() })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ ok: false, error: `/${slug} already exists.` }, { status: 409 })
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
