-- Drop existing tables if they exist
drop table if exists relationships;
drop table if exists elements;
drop table if exists diagrams;

-- Create diagrams table
create table diagrams (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    user_id uuid references auth.users(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create elements table
create table elements (
    id uuid default gen_random_uuid() primary key,
    diagram_id uuid references diagrams(id) on delete cascade,
    type text not null check (type in ('class', 'interface', 'textbox')),
    name text,
    x numeric not null,
    y numeric not null,
    methods jsonb[] default array[]::jsonb[],
    attributes jsonb[] default array[]::jsonb[],
    text text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create relationships table
create table relationships (
    id uuid default gen_random_uuid() primary key,
    diagram_id uuid references diagrams(id) on delete cascade,
    source_id uuid references elements(id) on delete cascade,
    target_id uuid references elements(id) on delete cascade,
    type text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table diagrams enable row level security;
alter table elements enable row level security;
alter table relationships enable row level security;

-- Diagrams policies
create policy "Users can view their own diagrams"
    on diagrams for select
    using (auth.uid() = user_id);

create policy "Users can create their own diagrams"
    on diagrams for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own diagrams"
    on diagrams for update
    using (auth.uid() = user_id);

create policy "Users can delete their own diagrams"
    on diagrams for delete
    using (auth.uid() = user_id);

-- Elements policies
create policy "Users can view elements of their diagrams"
    on elements for select
    using (exists (
        select 1 from diagrams
        where diagrams.id = elements.diagram_id
        and diagrams.user_id = auth.uid()
    ));

create policy "Users can create elements in their diagrams"
    on elements for insert
    with check (exists (
        select 1 from diagrams
        where diagrams.id = elements.diagram_id
        and diagrams.user_id = auth.uid()
    ));

create policy "Users can update elements in their diagrams"
    on elements for update
    using (exists (
        select 1 from diagrams
        where diagrams.id = elements.diagram_id
        and diagrams.user_id = auth.uid()
    ));

create policy "Users can delete elements in their diagrams"
    on elements for delete
    using (exists (
        select 1 from diagrams
        where diagrams.id = elements.diagram_id
        and diagrams.user_id = auth.uid()
    ));

-- Relationships policies
create policy "Users can view relationships in their diagrams"
    on relationships for select
    using (exists (
        select 1 from diagrams
        where diagrams.id = relationships.diagram_id
        and diagrams.user_id = auth.uid()
    ));

create policy "Users can create relationships in their diagrams"
    on relationships for insert
    with check (exists (
        select 1 from diagrams
        where diagrams.id = relationships.diagram_id
        and diagrams.user_id = auth.uid()
    ));

create policy "Users can update relationships in their diagrams"
    on relationships for update
    using (exists (
        select 1 from diagrams
        where diagrams.id = relationships.diagram_id
        and diagrams.user_id = auth.uid()
    ));

create policy "Users can delete relationships in their diagrams"
    on relationships for delete
    using (exists (
        select 1 from diagrams
        where diagrams.id = relationships.diagram_id
        and diagrams.user_id = auth.uid()
    ));

-- Create indexes for better performance
create index if not exists idx_diagrams_user_id on diagrams(user_id);
create index if not exists idx_elements_diagram_id on elements(diagram_id);
create index if not exists idx_relationships_diagram_id on relationships(diagram_id);
create index if not exists idx_relationships_source_id on relationships(source_id);
create index if not exists idx_relationships_target_id on relationships(target_id);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Add triggers for updated_at
create trigger update_diagrams_updated_at
    before update on diagrams
    for each row
    execute function update_updated_at_column();

create trigger update_elements_updated_at
    before update on elements
    for each row
    execute function update_updated_at_column();

create trigger update_relationships_updated_at
    before update on relationships
    for each row
    execute function update_updated_at_column();