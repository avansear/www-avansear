import { redirect, notFound } from 'next/navigation'
import { createServiceRoleSupabase } from 'lib/travelogue-markers'

export const dynamic = 'force-dynamic'

export default async function SlugRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = createServiceRoleSupabase()
  if (!supabase) notFound()

  const { data } = await supabase
    .from('redirects')
    .select('url')
    .eq('slug', slug)
    .single()

  if (!data?.url) notFound()

  redirect(data.url)
}
