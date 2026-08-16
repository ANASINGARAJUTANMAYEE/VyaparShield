-- CyberSure MSME baseline schema. Run this migration in a new Supabase project.
create extension if not exists pgcrypto;

create type public.target_status as enum ('pending', 'verified', 'revoked');
create type public.verification_method as enum ('dns_txt', 'http_file');
create type public.scan_status as enum ('queued', 'running', 'completed', 'failed', 'cancelled');
create type public.severity as enum ('critical', 'high', 'medium', 'low', 'info');
create type public.finding_status as enum ('open', 'fixed', 'resolved', 'accepted_risk');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text not null default 'English' check (preferred_language in ('English', 'Hindi', 'Hinglish')),
  created_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 160),
  industry text,
  employee_range text,
  handles_customer_data boolean not null default false,
  accepts_online_payments boolean not null default false,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_members (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'member', 'consultant')),
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);

create table public.targets (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  canonical_origin text not null,
  hostname text not null,
  status public.target_status not null default 'pending',
  verification_token_hash text not null,
  verified_at timestamptz,
  verified_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, hostname),
  check (canonical_origin like 'https://%')
);

create table public.target_verifications (
  id uuid primary key default gen_random_uuid(),
  target_id uuid not null references public.targets(id) on delete cascade,
  method public.verification_method not null,
  result text not null check (result in ('success', 'failed')),
  evidence jsonb not null default '{}'::jsonb,
  verified_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.scan_consents (
  id uuid primary key default gen_random_uuid(),
  target_id uuid not null references public.targets(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  scope_version text not null,
  accepted_at timestamptz not null default now(),
  ip_address inet,
  user_agent text,
  revoked_at timestamptz
);

create table public.scans (
  id uuid primary key default gen_random_uuid(),
  target_id uuid not null references public.targets(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete restrict,
  status public.scan_status not null default 'queued',
  scope_version text not null,
  scanner_version text,
  score integer check (score between 0 and 100),
  started_at timestamptz,
  completed_at timestamptz,
  error_code text,
  error_message text,
  created_at timestamptz not null default now()
);

create table public.findings (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  rule_id text not null,
  category text not null,
  severity public.severity not null,
  title text not null,
  evidence jsonb not null default '{}'::jsonb,
  owner_explanation jsonb not null default '{}'::jsonb,
  developer_guidance text not null,
  remediation_status public.finding_status not null default 'open',
  marked_fixed_at timestamptz,
  marked_fixed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  business_id uuid references public.businesses(id) on delete cascade,
  target_id uuid references public.targets(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index targets_business_id_idx on public.targets(business_id);
create index scans_target_created_idx on public.scans(target_id, created_at desc);
create index findings_scan_id_idx on public.findings(scan_id);
create index audit_events_target_created_idx on public.audit_events(target_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger businesses_set_updated_at before update on public.businesses for each row execute procedure public.set_updated_at();
create trigger targets_set_updated_at before update on public.targets for each row execute procedure public.set_updated_at();

create or replace function public.is_business_member(target_business_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.business_members
    where business_id = target_business_id and user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.targets enable row level security;
alter table public.target_verifications enable row level security;
alter table public.scan_consents enable row level security;
alter table public.scans enable row level security;
alter table public.findings enable row level security;
alter table public.audit_events enable row level security;

create policy "users manage own profile" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "members view businesses" on public.businesses for select using (public.is_business_member(id));
create policy "users create businesses" on public.businesses for insert with check (created_by = auth.uid());
create policy "owners update businesses" on public.businesses for update using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy "members view memberships" on public.business_members for select using (public.is_business_member(business_id));
create policy "business creators add first membership" on public.business_members for insert with check (user_id = auth.uid() and exists (select 1 from public.businesses where id = business_id and created_by = auth.uid()));
create policy "members access targets" on public.targets for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));
create policy "members access verifications" on public.target_verifications for all using (exists (select 1 from public.targets t where t.id = target_id and public.is_business_member(t.business_id))) with check (exists (select 1 from public.targets t where t.id = target_id and public.is_business_member(t.business_id)));
create policy "users access own target consents" on public.scan_consents for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "members access scans" on public.scans for all using (exists (select 1 from public.targets t where t.id = target_id and public.is_business_member(t.business_id))) with check (exists (select 1 from public.targets t where t.id = target_id and public.is_business_member(t.business_id)));
create policy "members access findings" on public.findings for all using (exists (select 1 from public.scans s join public.targets t on t.id = s.target_id where s.id = scan_id and public.is_business_member(t.business_id))) with check (exists (select 1 from public.scans s join public.targets t on t.id = s.target_id where s.id = scan_id and public.is_business_member(t.business_id)));
create policy "members view audit events" on public.audit_events for select using (business_id is not null and public.is_business_member(business_id));
create policy "members create audit events" on public.audit_events for insert with check (business_id is not null and public.is_business_member(business_id));
