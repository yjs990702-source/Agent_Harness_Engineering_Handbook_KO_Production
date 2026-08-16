begin;

create table if not exists public.work_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  title text not null check (char_length(btrim(title)) between 3 and 100),
  category text not null check (category in ('general', 'security', 'operations')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'done')),
  due_date date,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists work_requests_owner_created_idx
  on public.work_requests (tenant_id, created_by, created_at desc);

alter table public.work_requests enable row level security;

drop policy if exists work_requests_select_own on public.work_requests;
create policy work_requests_select_own
  on public.work_requests
  for select
  to authenticated
  using (
    created_by = auth.uid()
    and tenant_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'tenant_id', '')
  );

drop policy if exists work_requests_insert_own on public.work_requests;
create policy work_requests_insert_own
  on public.work_requests
  for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and tenant_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'tenant_id', '')
  );

revoke all on table public.work_requests from anon;
grant select, insert on table public.work_requests to authenticated;

commit;

