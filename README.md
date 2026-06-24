# ismyemailworking.app

Full mailbox email verification, built with Next.js, Supabase, Stripe, and ZeroBounce.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (auth + database)
- Stripe (one-time credit purchases)
- ZeroBounce (mailbox verification)
- PapaParse (client-side CSV preview)
- MDX (blog)

## Local development

```bash
npm install
cp .env.local.example .env.local   # fill in the values below
npm run dev
```

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ZEROBOUNCE_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=https://ismyemailworking.app

# One Stripe Price ID per credit pack
STRIPE_PRICE_STARTER=
STRIPE_PRICE_GROWTH=
STRIPE_PRICE_PRO=
STRIPE_PRICE_BUSINESS=
```

## Database schema

The full schema (tables + row-level security policies) lives in
[`supabase/schema.sql`](supabase/schema.sql). Run it in the Supabase SQL editor
on a fresh project before connecting the app.

## Deployment checklist

1. **Supabase**, create a project, run `supabase/schema.sql` in the SQL editor,
   copy the project URL, anon key, and service role key into your env vars.
2. **ZeroBounce**, create an account, generate an API key, set `ZEROBOUNCE_API_KEY`.
3. **Stripe**, create an account, create 4 one-time Price objects (Starter $3,
   Growth $12, Pro $39, Business $149), copy each Price ID into the
   `STRIPE_PRICE_*` env vars, copy the secret and publishable keys, and create a
   webhook endpoint pointed at `/api/stripe/webhook` listening for
   `checkout.session.completed`, copy the signing secret into
   `STRIPE_WEBHOOK_SECRET`.
4. **Push to GitHub.**
5. **Vercel**, connect the repo, add all env vars in the Vercel dashboard.
6. **Domain**, point `ismyemailworking.app` DNS at Vercel.
7. **Supabase Auth**, add your production domain to the allowed redirect URLs
   (Authentication → URL Configuration) so magic links resolve correctly.
8. **Test end-to-end**: run a free check → log in → buy a credit pack → upload a
   CSV in Bulk Upload → download the completed report.

## Notes on bulk verification at scale

Bulk jobs are processed via a fire-and-forget async function inside the
`/api/bulk-verify` route handler. This works for moderate list sizes during
development, but Vercel serverless functions don't guarantee execution past
the point the HTTP response is sent. For production traffic at real volume,
move `processJob` in `app/api/bulk-verify/route.ts` into a durable queue
(e.g. Inngest, QStash, or a Supabase Edge Function triggered by a database
row) so jobs survive function timeouts and retries.

## Project structure

See the route groups under `app/` for marketing pages, auth, and the
authenticated dashboard. Blog content lives in `content/blog/*.mdx`. Shared
UI primitives are in `components/ui/`.
