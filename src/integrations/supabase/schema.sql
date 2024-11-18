create table diagrams (
  id text primary key,
  name text not null,
  elements jsonb not null default '[]'::jsonb,
  relationships jsonb not null default '[]'::jsonb,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table diagrams enable row level security;

create policy "Users can create their own diagrams"
  on diagrams for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own diagrams"
  on diagrams for select
  using (auth.uid() = user_id);

create policy "Users can update their own diagrams"
  on diagrams for update
  using (auth.uid() = user_id);

create policy "Users can delete their own diagrams"
  on diagrams for delete
  using (auth.uid() = user_id);