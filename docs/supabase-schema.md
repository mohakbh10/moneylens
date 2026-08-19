# Supabase schema and security reference

This is documentation of the existing Supabase schema and policies. It is not a
migration: the production database already exists, and defaults/index names were
not exported with this project. Generate migrations from the live Supabase
schema before using a new environment.

## Tables

| Table | Ownership and relationships |
| --- | --- |
| `uploads` | `id UUID`; `user_id UUID`; stores statement metadata and `raw_text`. |
| `transactions` | `id UUID`; `upload_id UUID` references `uploads.id`. |
| `insights` | `id UUID`; `upload_id UUID` references `uploads.id`. |
| `budgets` | `id UUID`; `user_id UUID` references `auth.users.id` with `ON DELETE CASCADE`; unique on `(user_id, category, month)`. |
| `chat_messages` | `id UUID`; `upload_id UUID` references `uploads.id`. |

`uploads` includes `file_name TEXT`, `file_url TEXT`, `created_at TIMESTAMP`, and
`raw_text TEXT`. `transactions` stores date, description, amount, type, category,
and `created_at`. `insights` stores calculated totals, category/expense details,
AI summary/recommendation text, and `created_at`. `budgets` stores category,
numeric amount, text month (`YYYY-MM`), and `created_at`. `chat_messages` stores
role, message, and `created_at`.

## Existing isolation model

RLS is enabled on `uploads`, `transactions`, `insights`, `budgets`, and
`chat_messages`.

- Budget access is limited to `auth.uid() = user_id` for select, insert, update,
  and delete.
- Upload access is limited to `auth.uid() = user_id` for select, insert, and
  delete.
- Transaction, insight, and chat-message policies require the linked upload to
  belong to `auth.uid()`.
- The private `bank-statements` bucket allows select, insert, and delete only
  when the first object-path segment matches `auth.uid()`.

The frontend stores statement files under `<user_id>/<timestamp>-<filename>` to
work with the Storage policy. Do not make the bucket public or weaken these
policies.
