create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'visit_source_type'
  ) then
    create type public.visit_source_type as enum ('photo', 'text');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'location_confidence_level'
  ) then
    create type public.location_confidence_level as enum ('low', 'medium', 'high', 'manual');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  preferred_map_theme text not null default 'red',
  home_airport_code text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_home_airport_code_format
    check (home_airport_code is null or home_airport_code ~ '^[A-Z]{3}$')
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  country_code text not null,
  country_name text not null,
  city_name text,
  latitude double precision,
  longitude double precision,
  source_type public.visit_source_type not null,
  location_confidence public.location_confidence_level not null default 'manual',
  visited_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint visits_country_code_format check (country_code ~ '^[A-Z]{2}$'),
  constraint visits_latitude_range check (latitude is null or latitude between -90 and 90),
  constraint visits_longitude_range check (longitude is null or longitude between -180 and 180)
);

create table if not exists public.photo_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  visit_id uuid not null references public.visits (id) on delete cascade,
  storage_bucket text not null default 'travel-photos',
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size_bytes bigint,
  captured_at timestamptz,
  exif_latitude double precision,
  exif_longitude double precision,
  inferred_country_code text,
  inferred_country_name text,
  inferred_city_name text,
  inferred_latitude double precision,
  inferred_longitude double precision,
  inferred_location_confidence public.location_confidence_level,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint photo_assets_storage_path_unique unique (storage_path),
  constraint photo_assets_country_code_format
    check (inferred_country_code is null or inferred_country_code ~ '^[A-Z]{2}$'),
  constraint photo_assets_exif_latitude_range
    check (exif_latitude is null or exif_latitude between -90 and 90),
  constraint photo_assets_exif_longitude_range
    check (exif_longitude is null or exif_longitude between -180 and 180),
  constraint photo_assets_inferred_latitude_range
    check (inferred_latitude is null or inferred_latitude between -90 and 90),
  constraint photo_assets_inferred_longitude_range
    check (inferred_longitude is null or inferred_longitude between -180 and 180)
);

create table if not exists public.travel_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  visit_id uuid not null references public.visits (id) on delete cascade,
  title text,
  content text not null,
  country_code text not null,
  city_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint travel_posts_country_code_format check (country_code ~ '^[A-Z]{2}$')
);

create index if not exists visits_user_id_visited_at_idx
  on public.visits (user_id, visited_at desc nulls last, created_at desc);

create index if not exists visits_user_id_country_code_idx
  on public.visits (user_id, country_code);

create index if not exists photo_assets_visit_id_idx
  on public.photo_assets (visit_id, captured_at desc nulls last, created_at desc);

create index if not exists photo_assets_user_id_idx
  on public.photo_assets (user_id);

create index if not exists travel_posts_visit_id_idx
  on public.travel_posts (visit_id, updated_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_visits_updated_at on public.visits;
create trigger set_visits_updated_at
before update on public.visits
for each row
execute function public.set_updated_at();

drop trigger if exists set_photo_assets_updated_at on public.photo_assets;
create trigger set_photo_assets_updated_at
before update on public.photo_assets
for each row
execute function public.set_updated_at();

drop trigger if exists set_travel_posts_updated_at on public.travel_posts;
create trigger set_travel_posts_updated_at
before update on public.travel_posts
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.email)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.visits enable row level security;
alter table public.photo_assets enable row level security;
alter table public.travel_posts enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "visits_manage_own" on public.visits;
create policy "visits_manage_own"
on public.visits
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "photo_assets_manage_own" on public.photo_assets;
create policy "photo_assets_manage_own"
on public.photo_assets
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "travel_posts_manage_own" on public.travel_posts;
create policy "travel_posts_manage_own"
on public.travel_posts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('travel-photos', 'travel-photos', false)
on conflict (id) do nothing;

drop policy if exists "travel_photos_select_own" on storage.objects;
create policy "travel_photos_select_own"
on storage.objects
for select
using (
  bucket_id = 'travel-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "travel_photos_insert_own" on storage.objects;
create policy "travel_photos_insert_own"
on storage.objects
for insert
with check (
  bucket_id = 'travel-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "travel_photos_update_own" on storage.objects;
create policy "travel_photos_update_own"
on storage.objects
for update
using (
  bucket_id = 'travel-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'travel-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "travel_photos_delete_own" on storage.objects;
create policy "travel_photos_delete_own"
on storage.objects
for delete
using (
  bucket_id = 'travel-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
