-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Create a table for bookmarks
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  url text not null,
  title text,
  description text,
  image_url text,
  favicon_url text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table bookmarks enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Bookmarks policies
create policy "Users can view their own bookmarks only." on bookmarks
  for select using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks." on bookmarks
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own bookmarks." on bookmarks
  for update using (auth.uid() = user_id);

create policy "Users can delete their own bookmarks." on bookmarks
  for delete using (auth.uid() = user_id);

-- Set up Realtime for bookmarks
alter publication supabase_realtime add table bookmarks;

-- Handle profile creation on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
