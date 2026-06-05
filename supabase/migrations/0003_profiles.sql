-- ============================================================================
-- 0003_profiles
-- Table profils : miroir queryable des données profil + onboarding (jusque-là
-- seulement dans auth.users.user_metadata, non exploitable pour le business).
-- Permet au business de savoir qui s'inscrit, taille de boîte, canal d'acquisition.
-- Inclut une colonne `notify` (intérêt features à venir) pour l'étape suivante.
-- ============================================================================

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text,
  name          text,
  company       text,
  role          text,
  website       text,
  avatar_url    text,
  company_size  text,
  heard_from    text,
  notify        text[] not null default '{}',
  onboarded     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Chaque user ne voit/édite que son profil. (Le business lit tout via le
-- dashboard / service_role, hors RLS.)
create policy "profiles_owner_select" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_owner_insert" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "profiles_owner_update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-création d'un profil à chaque inscription (Google ou email).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name, avatar_url, onboarded)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    coalesce((new.raw_user_meta_data->>'onboarded')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill des utilisateurs déjà existants depuis leurs user_metadata.
insert into public.profiles (
  id, email, name, avatar_url, company, role, website, company_size, heard_from, onboarded
)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'name', u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  coalesce(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
  u.raw_user_meta_data->>'company',
  u.raw_user_meta_data->>'role',
  u.raw_user_meta_data->>'website',
  u.raw_user_meta_data->>'company_size',
  u.raw_user_meta_data->>'heard_from',
  coalesce((u.raw_user_meta_data->>'onboarded')::boolean, false)
from auth.users u
on conflict (id) do nothing;
