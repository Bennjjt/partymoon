import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)

  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret || !signature || !(await isValidSignature(body, signature, secret))) {
    return new Response('Invalid signature', { status: 401 })
  }

  // Must be awaited: Vercel can terminate the function's execution context
  // as soon as a Response is returned, so an un-awaited fetch here may never
  // actually reach the deploy hook before the process is frozen/killed.
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
  if (deployHookUrl) {
    try {
      const res = await fetch(deployHookUrl, { method: 'POST' })
      if (!res.ok) {
        console.error('[webhooks/sanity] Vercel deploy hook responded with', res.status)
      }
    } catch (err) {
      console.error('[webhooks/sanity] Vercel deploy hook failed:', err)
    }
  } else {
    console.warn('[webhooks/sanity] VERCEL_DEPLOY_HOOK_URL is not set — skipping rebuild trigger.')
  }

  return new Response('OK', { status: 200 })
}
