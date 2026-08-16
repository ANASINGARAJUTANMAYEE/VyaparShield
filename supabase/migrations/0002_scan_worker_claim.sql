-- A worker claims one job atomically. This function is intended for a service-role
-- worker only; the public app never calls it.
create or replace function public.claim_next_scan(worker_id text)
returns table (
  scan_id uuid,
  target_id uuid,
  canonical_origin text,
  hostname text,
  scope_version text
)
language plpgsql
security definer
set search_path = public
as $$
declare claimed_id uuid;
begin
  select id into claimed_id
  from public.scans
  where status = 'queued'
  order by created_at asc
  for update skip locked
  limit 1;

  if claimed_id is null then return; end if;

  return query
  update public.scans s
  set status = 'running', started_at = now(), scanner_version = worker_id
  from public.targets t
  where s.id = claimed_id and t.id = s.target_id
  returning s.id, t.id, t.canonical_origin, t.hostname, s.scope_version;
end;
$$;

revoke all on function public.claim_next_scan(text) from public, anon, authenticated;
grant execute on function public.claim_next_scan(text) to service_role;
