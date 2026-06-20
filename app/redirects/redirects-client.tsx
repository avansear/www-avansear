'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { RedirectRow } from './page'

type Props = {
  initialAuthenticated: boolean
  initialRedirects: RedirectRow[]
}

export function RedirectsClient({ initialAuthenticated, initialRedirects }: Props) {
  const router = useRouter()

  const [authenticated, setAuthenticated] = useState(initialAuthenticated)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginPending, setLoginPending] = useState(false)

  const [slug, setSlug] = useState('')
  const [url, setUrl] = useState('')
  const [addPending, setAddPending] = useState(false)
  const [addMessage, setAddMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(null)
    setLoginPending(true)
    try {
      const res = await fetch('/api/redirects/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setLoginError(data.error ?? 'login failed.')
        return
      }
      setPassword('')
      setAuthenticated(true)
      router.refresh()
    } catch {
      setLoginError('network error.')
    } finally {
      setLoginPending(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/redirects/admin/logout', { method: 'POST' })
    setAuthenticated(false)
    router.refresh()
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAddMessage(null)
    setAddPending(true)
    try {
      const res = await fetch('/api/redirects/admin/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slug.replace(/^\//, ''), url }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setAddMessage({ ok: false, text: data.error ?? 'failed to add redirect.' })
        return
      }
      setAddMessage({ ok: true, text: `avansear.com/${slug.replace(/^\//, '')} is now live.` })
      setSlug('')
      setUrl('')
      router.refresh()
    } catch {
      setAddMessage({ ok: false, text: 'network error.' })
    } finally {
      setAddPending(false)
    }
  }

  async function handleDelete(slugToDelete: string) {
    setDeletingSlug(slugToDelete)
    try {
      await fetch('/api/redirects/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slugToDelete }),
      })
      router.refresh()
    } finally {
      setDeletingSlug(null)
    }
  }

  if (!authenticated) {
    return (
      <form onSubmit={handleLogin} className="mt-6 flex max-w-sm flex-col gap-3 lowercase">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--color-dark)] dark:text-[var(--color-light)]">password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="normal-case rounded border border-[var(--color-dark)]/20 bg-[var(--color-light)] px-3 py-2 text-[var(--color-dark)] dark:border-[var(--color-light)]/20 dark:bg-[var(--color-dark)] dark:text-[var(--color-light)]"
            required
          />
        </label>
        {loginError ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {loginError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loginPending}
          className="rounded border border-[var(--color-dark)]/20 px-3 py-2 text-sm font-medium text-[var(--color-dark)] hover:bg-[var(--color-dark)]/5 dark:border-[var(--color-light)]/20 dark:text-[var(--color-light)] dark:hover:bg-[var(--color-light)]/10 disabled:opacity-50"
        >
          {loginPending ? 'signing in…' : 'sign in'}
        </button>
      </form>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-8 lowercase">
      <form onSubmit={handleAdd} className="flex max-w-lg flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex flex-col gap-1 text-sm sm:w-40">
            <span className="text-[var(--color-dark)] dark:text-[var(--color-light)]">slug</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              placeholder="gh"
              className="normal-case rounded border border-[var(--color-dark)]/20 bg-[var(--color-light)] px-3 py-2 font-mono text-sm text-[var(--color-dark)] dark:border-[var(--color-light)]/20 dark:bg-[var(--color-dark)] dark:text-[var(--color-light)]"
              required
            />
            {slug ? (
              <span className="font-mono text-xs text-[var(--color-dark)]/50 dark:text-[var(--color-light)]/50">
                avansear.com/{slug.replace(/^\//, '')}
              </span>
            ) : null}
          </label>

          <label className="flex flex-1 flex-col gap-1 text-sm">
            <span className="text-[var(--color-dark)] dark:text-[var(--color-light)]">destination url</span>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="normal-case rounded border border-[var(--color-dark)]/20 bg-[var(--color-light)] px-3 py-2 text-sm text-[var(--color-dark)] dark:border-[var(--color-light)]/20 dark:bg-[var(--color-dark)] dark:text-[var(--color-light)]"
              required
            />
          </label>
        </div>

        {addMessage ? (
          <p
            className={`text-sm lowercase ${addMessage.ok ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            role="status"
          >
            {addMessage.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={addPending}
          className="w-fit rounded border border-[var(--color-dark)]/20 px-4 py-2 text-sm font-medium text-[var(--color-dark)] hover:bg-[var(--color-dark)]/5 dark:border-[var(--color-light)]/20 dark:text-[var(--color-light)] dark:hover:bg-[var(--color-light)]/10 disabled:opacity-50"
        >
          {addPending ? 'adding…' : 'add redirect'}
        </button>
      </form>

      {initialRedirects.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[var(--color-dark)]/50 dark:text-[var(--color-light)]/50">
            {initialRedirects.length} redirect{initialRedirects.length !== 1 ? 's' : ''}
          </p>
          <ul className="flex flex-col divide-y divide-[var(--color-dark)]/10 dark:divide-[var(--color-light)]/10">
            {initialRedirects.map((r) => (
              <li key={r.slug} className="flex items-center justify-between gap-4 py-2 text-sm">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-mono text-[var(--color-dark)] dark:text-[var(--color-light)]">
                    /{r.slug}
                  </span>
                  <span className="truncate text-xs text-[var(--color-dark)]/50 dark:text-[var(--color-light)]/50">
                    {r.url}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(r.slug)}
                  disabled={deletingSlug === r.slug}
                  className="shrink-0 text-xs text-red-600 underline hover:no-underline dark:text-red-400 disabled:opacity-50"
                >
                  {deletingSlug === r.slug ? 'deleting…' : 'delete'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void handleLogout()}
        className="w-fit text-sm text-[var(--color-dark)]/70 underline dark:text-[var(--color-light)]/70"
      >
        sign out
      </button>
    </div>
  )
}
