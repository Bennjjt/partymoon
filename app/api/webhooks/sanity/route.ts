import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)

  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret || !signature || !(await isValidSignature(body, signature, secret))) {
    return new Response('Invalid signature', { status: 401 })
  }

  // Fire-and-forget rebuild trigger — the webhook delivery shouldn't block on
  // (or fail because of) Vercel's response, matching the Loops sync pattern
  // used elsewhere in this codebase.
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
  if (deployHookUrl) {
    fetch(deployHookUrl, { method: 'POST' }).catch((err) => {
      console.error('[webhooks/sanity] Vercel deploy hook failed:', err)
    })
  } else {
    console.warn('[webhooks/sanity] VERCEL_DEPLOY_HOOK_URL is not set — skipping rebuild trigger.')
  }

  return new Response('OK', { status: 200 })
}
