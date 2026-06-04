create table if not exists public.trip_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  itinerary jsonb not null default '[]'::jsonb,
  expenses jsonb not null default '[]'::jsonb,
  packing_list jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.trip_profiles enable row level security;

drop policy if exists "Users can read own trip profile" on public.trip_profiles;
create policy "Users can read own trip profile"
on public.trip_profiles for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own trip profile" on public.trip_profiles;
create policy "Users can insert own trip profile"
on public.trip_profiles for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own trip profile" on public.trip_profiles;
create policy "Users can update own trip profile"
on public.trip_profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.set_trip_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_trip_profiles_updated_at on public.trip_profiles;
create trigger set_trip_profiles_updated_at
before update on public.trip_profiles
for each row
execute function public.set_trip_profiles_updated_at();
