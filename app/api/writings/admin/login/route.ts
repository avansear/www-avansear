import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createWritingsAdminSessionToken, WRITINGS_ADMIN_COOKIE, passwordsEqual } from 'lib/writings-admin-session'

export async function POST(request: Request) {
  const expected = process.env.CUSTOM_PASS
  if (!expected) {
    return NextResponse.json({ ok: false, error: 'server is not configured (CUSTOM_PASS).' }, { status: 503 })
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON.' }, { status: 400 })
  }

  const password = typeof body.password === 'string' ? body.password : ''
  if (!passwordsEqual(password, expected)) {
    return NextResponse.json({ ok: false, error: 'incorrect password.' }, { status: 401 })
  }

  const token = createWritingsAdminSessionToken()
  if (!token) {
    return NextResponse.json({ ok: false, error: 'could not create session.' }, { status: 500 })
  }

  const cookieStore = await cookies()
  cookieStore.set(WRITINGS_ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  return NextResponse.json({ ok: true })
}
