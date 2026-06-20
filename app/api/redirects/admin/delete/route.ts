import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyRedirectsAdminSessionToken, REDIRECTS_ADMIN_COOKIE } from 'lib/redirects-admin-session'
import { createServiceRoleSupabase } from 'lib/travelogue-markers'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(REDIRECTS_ADMIN_COOKIE)?.value
  if (!verifyRedirectsAdminSessionToken(token)) {
    return NextResponse.json({ ok: false, error: 'unauthorized.' }, { status: 401 })
  }

  let body: { slug?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON.' }, { status: 400 })
  }

  const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
  if (!slug) {
    return NextResponse.json({ ok: false, error: 'slug is required.' }, { status: 422 })
  }

  const supabase = createServiceRoleSupabase()
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'supabase is not configured.' }, { status: 503 })
  }

  const { error } = await supabase.from('redirects').delete().eq('slug', slug)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
