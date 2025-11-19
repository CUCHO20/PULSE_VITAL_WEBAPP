-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create health_data table
create table if not exists public.health_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sleep_level integer,
  sleep_hours text,
  emotion text,
  eating_habits text[] default array[]::text[],
  medications text[] default array[]::text[],
  symptoms text[] default array[]::text[],
  health_goals text[] default array[]::text[],
  gender text,
  weight numeric,
  weight_unit text,
  age integer,
  blood_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles table
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Enable RLS on health_data table
alter table public.health_data enable row level security;

-- RLS policies for health_data
create policy "Users can view their own health data"
  on public.health_data for select
  using (auth.uid() = user_id);

create policy "Users can insert their own health data"
  on public.health_data for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own health data"
  on public.health_data for update
  using (auth.uid() = user_id);

create policy "Users can delete their own health data"
  on public.health_data for delete
  using (auth.uid() = user_id);
