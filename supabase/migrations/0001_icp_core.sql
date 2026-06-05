-- ============================================================================
-- 0001_icp_core
-- Tables coeur de l'outil ICP : icps, icp_sessions, spec_drafts.
-- Persistance Supabase (remplace le localStorage du store Zustand).
-- Securise par RLS : chaque user ne voit que ses lignes ; les ICP partages
-- (shared = true) sont lisibles publiquement (page /icp/public/[shareId]).
-- ============================================================================

-- Fonction utilitaire : maintient updated_at a jour.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- icps : un ICP finalise (ou brouillon) par ligne.
-- id = id texte genere cote client (icp_...) pour garder les updates optimistes.
-- data = document ICP complet (synthese, panel, identite, marche, ...).
-- ----------------------------------------------------------------------------
create table public.icps (
  id          text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  segment     text not null default '',
  status      text not null default 'draft' check (status in ('draft', 'final')),
  version     int  not null default 1,
  share_id    text unique,
  shared      boolean not null default false,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index icps_user_created_idx on public.icps (user_id, created_at desc);
create index icps_share_idx on public.icps (share_id) where share_id is not null;

alter table public.icps enable row level security;

-- Proprietaire : acces complet a ses ICP.
create policy "icps_owner_all" on public.icps
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Lecture publique des ICP partages (page de partage, sans auth).
create policy "icps_public_shared_select" on public.icps
  for select to anon, authenticated
  using (shared = true);

create trigger icps_set_updated_at
  before update on public.icps
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- icp_sessions : conversation de chat en cours (SessionDraft serialise).
-- Une session non finalisee (final = false) = celle a reprendre.
-- ----------------------------------------------------------------------------
create table public.icp_sessions (
  id          text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  final       boolean not null default false,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index icp_sessions_user_idx on public.icp_sessions (user_id, updated_at desc);

alter table public.icp_sessions enable row level security;

create policy "icp_sessions_owner_all" on public.icp_sessions
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create trigger icp_sessions_set_updated_at
  before update on public.icp_sessions
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- spec_drafts : brouillon du wizard "j'ai deja mon ICP" (1 par user).
-- ----------------------------------------------------------------------------
create table public.spec_drafts (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.spec_drafts enable row level security;

create policy "spec_drafts_owner_all" on public.spec_drafts
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create trigger spec_drafts_set_updated_at
  before update on public.spec_drafts
  for each row execute function public.set_updated_at();
