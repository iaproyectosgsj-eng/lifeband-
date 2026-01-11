# Supabase migrations for Lifeband

This folder contains SQL migrations to create the Lifeband schema and row-level security policies.

How to apply (recommended using Supabase CLI or psql):

1. Install Supabase CLI: `npm install -g supabase` or see https://supabase.com/docs
2. Authenticate: `supabase login`
3. From your project root, run the SQL files against your database. Example using `psql`:

```bash
# Export your DATABASE_URL (Supabase project connection string)
psql "$DATABASE_URL" -f supabase/migrations/001_create_tables_and_triggers.sql
psql "$DATABASE_URL" -f supabase/migrations/002_enable_rls_and_policies.sql
```

Notes:
- The RLS policies assume `auth.uid()` corresponds to rows in `admins.id` (i.e. Supabase Auth users map to admin records). Adjust if you use a different mapping.
- Do NOT enable anonymous public SELECT on sensitive tables; the public PDF endpoint should be implemented as a separate Edge Function that checks `portadores.public_access_enabled` and `lifeband_status`.
