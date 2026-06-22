import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { client } from '@/lib/sanity/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  // Confirm the document exists (or is a known route) before enabling preview,
  // so the secret can't be used to enable draft mode against an arbitrary path.
  if (slug) {
    const exists = await client.fetch(
      /* groq */ `count(*[_type == "trip" && slug.current == $slug]) > 0`,
      { slug },
    )
    if (!exists) return new Response('Trip not found', { status: 404 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(slug ? `/${slug}` : '/')
}
