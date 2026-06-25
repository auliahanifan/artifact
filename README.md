# Artifact

Host HTML pages at `/{uniquecode}` with a simple public API. Deployed on Vercel, backed by Supabase Postgres.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/artifacts` | Create a new artifact |
| `GET` | `/{uniquecode}` | Serve stored HTML |

### Create artifact

```bash
curl -X POST http://localhost:3000/api/artifacts \
  -H "Content-Type: application/json" \
  -d '{"html":"<html><body><h1>Hello</h1></body></html>"}'
```

With a custom code:

```bash
curl -X POST http://localhost:3000/api/artifacts \
  -H "Content-Type: application/json" \
  -d '{"uniquecode":"demo","html":"<html><body>Demo</body></html>"}'
```

Response (`201`):

```json
{
  "uniquecode": "demo",
  "url": "http://localhost:3000/demo"
}
```

### View artifact

```bash
curl http://localhost:3000/demo
```

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → Database → Connection string**
3. Copy the **Transaction pooler** URI (port `6543`)

### 2. Local env

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase DATABASE_URL
```

### 3. Push schema

```bash
npx dotenv -e .env.local -- npx drizzle-kit push
```

### 4. Enable RLS (recommended)

Run in Supabase SQL Editor:

```sql
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
```

This blocks public access via Supabase Data API. The Next.js server connects directly with the `postgres` role.

### 5. Run locally

```bash
npm run dev
```

## Testing

End-to-end tests use Playwright against a real Supabase database:

```bash
# Requires .env.local with DATABASE_URL
npm run test:e2e
```

The test runner starts the dev server automatically and ensures the `artifacts` table exists before tests run.

## Deploy to Vercel

1. Push to GitHub and import in Vercel, or run `vercel`
2. Add `DATABASE_URL` environment variable (Transaction pooler URI)
3. Deploy

```bash
vercel env add DATABASE_URL
vercel --prod
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push schema to Supabase (requires `.env.local`) |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:ui` | Run Playwright tests with UI mode |
