-- ============================================================
-- Macaroon Garden — Supabase migrācija
-- Ielīmējiet un izpildiet šo Supabase projektā:
-- Dashboard → SQL Editor → New query → ielīmēt → Run
-- ============================================================

-- 1) Profilu tabula (telefons, adrese) katram reģistrētam lietotājam
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  phone text,
  address text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Lietotājs drīkst redzēt/rediģēt TIKAI savu profilu
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- 2) Piesaista pasūtījumus lietotāja kontam (lai var rādīt vēsturi / īpašus piedāvājumus)
alter table public.macaroon_orders
  add column if not exists user_id uuid references auth.users(id);

-- Lietotājs drīkst redzēt TIKAI savus pasūtījumus (vajadzīgs "Mans konts" vēsturei)
alter table public.macaroon_orders enable row level security;

drop policy if exists "orders_select_own" on public.macaroon_orders;
create policy "orders_select_own" on public.macaroon_orders
  for select using (auth.uid() = user_id);

drop policy if exists "orders_insert_any" on public.macaroon_orders;
create policy "orders_insert_any" on public.macaroon_orders
  for insert with check (true);

-- 3) Makarūnu Mozaīkas spēles līderu saraksts
create table if not exists public.game_scores (
  user_id uuid references auth.users(id) primary key,
  display_name text,
  score int not null default 0,
  updated_at timestamptz default now()
);
alter table public.game_scores enable row level security;

-- Jebkurš var redzēt līderu sarakstu (arī neielogojies apmeklētājs)
drop policy if exists "game_scores_select_all" on public.game_scores;
create policy "game_scores_select_all" on public.game_scores
  for select using (true);

-- Lietotājs drīkst pievienot/atjaunināt TIKAI savu rezultātu
drop policy if exists "game_scores_insert_own" on public.game_scores;
create policy "game_scores_insert_own" on public.game_scores
  for insert with check (auth.uid() = user_id);

drop policy if exists "game_scores_update_own" on public.game_scores;
create policy "game_scores_update_own" on public.game_scores
  for update using (auth.uid() = user_id);

-- ============================================================
-- Piezīme par e-pasta apstiprināšanu:
-- Supabase pēc noklusējuma pieprasa e-pasta apstiprināšanu pirms pirmās
-- ielogošanās. Ja vēlaties, lai klienti var uzreiz ielogoties bez e-pasta
-- apstiprināšanas, ejiet uz:
-- Authentication → Providers → Email → izslēdziet "Confirm email"
-- ============================================================
