-- Independent, family-scoped backend for Game do Biel.
-- All browser-accessible tables use RLS. Privileged transitions happen through RPCs.

create type public.member_role as enum ('responsavel', 'filho');
create type public.review_status as enum ('pendente', 'aprovado', 'recusado', 'correcao');
create type public.task_status as enum ('pendente', 'aguardando', 'aprovado', 'recusado');

create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  role public.member_role not null,
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar text not null default '🦸',
  created_at timestamptz not null default now(),
  unique (family_id, role)
);

create function public.current_family_id()
returns uuid language sql stable security definer set search_path = ''
as $$ select family_id from public.profiles where id = (select auth.uid()) $$;

create function public.is_responsavel()
returns boolean language sql stable security definer set search_path = ''
as $$ select coalesce((select role = 'responsavel' from public.profiles where id = (select auth.uid())), false) $$;

revoke all on function public.current_family_id() from public, anon;
revoke all on function public.is_responsavel() from public, anon;
grant execute on function public.current_family_id(), public.is_responsavel() to authenticated;

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  emoji text not null default '📋',
  weekdays text not null default 'all' check (weekdays in ('all','weekdays','weekends','once')),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete restrict,
  child_id uuid not null references public.profiles(id) on delete cascade,
  task_date date not null default ((now() at time zone 'America/Sao_Paulo')::date),
  status public.task_status not null default 'pendente',
  completed_at timestamptz,
  reviewed_at timestamptz,
  mom_note text,
  created_at timestamptz not null default now(),
  unique (task_id, child_id, task_date)
);

create table public.screen_time_settings (
  family_id uuid primary key references public.families(id) on delete cascade,
  guaranteed_minutes integer not null default 60 check (guaranteed_minutes between 0 and 1440),
  max_extra_minutes integer not null default 120 check (max_extra_minutes between 0 and 1440),
  cutoff_time time not null default '21:00',
  updated_at timestamptz not null default now()
);

create table public.initiative_activities (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  emoji text not null default '✨',
  minutes integer not null check (minutes between 1 and 240),
  max_per_day integer not null default 1 check (max_per_day between 1 and 20),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.initiative_logs (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  child_id uuid not null references public.profiles(id) on delete cascade,
  activity_id uuid not null references public.initiative_activities(id) on delete restrict,
  log_date date not null default ((now() at time zone 'America/Sao_Paulo')::date),
  description text,
  proposed_minutes integer not null check (proposed_minutes between 1 and 240),
  approved_minutes integer check (approved_minutes between 0 and 240),
  status public.review_status not null default 'pendente',
  mom_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.school_logs (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  child_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null default ((now() at time zone 'America/Sao_Paulo')::date),
  done_activities text,
  pending_tasks text,
  subjects text,
  difficulties text,
  needs_help boolean not null default false,
  has_pending boolean not null default false,
  status public.review_status not null default 'pendente',
  mom_note text,
  reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (child_id, log_date)
);

create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  child_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null default ((now() at time zone 'America/Sao_Paulo')::date),
  school_ok boolean not null default false,
  initiatives text,
  pending text,
  improve text,
  status public.review_status not null default 'pendente',
  mom_note text,
  reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (child_id, log_date)
);

create table public.screen_time_ledger (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  child_id uuid not null references public.profiles(id) on delete cascade,
  event_date date not null default ((now() at time zone 'America/Sao_Paulo')::date),
  event_type text not null check (event_type in ('iniciativa','uso','ajuste')),
  minutes integer not null check (minutes between -1440 and 1440 and minutes <> 0),
  source_id uuid,
  note text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create unique index screen_time_ledger_initiative_once
  on public.screen_time_ledger(source_id) where event_type = 'iniciativa';

create function public.guard_daily_task_update()
returns trigger language plpgsql set search_path = '' as $$
begin
  if not public.is_responsavel() then
    if old.child_id <> (select auth.uid()) or old.status <> 'pendente' or new.status <> 'aguardando' then
      raise exception 'Transição de tarefa não permitida';
    end if;
    new.family_id := old.family_id;
    new.task_id := old.task_id;
    new.child_id := old.child_id;
    new.task_date := old.task_date;
    new.reviewed_at := old.reviewed_at;
    new.mom_note := old.mom_note;
    new.completed_at := now();
  end if;
  return new;
end $$;
revoke all on function public.guard_daily_task_update() from public, anon, authenticated;
create trigger guard_daily_task before update on public.daily_tasks
  for each row execute function public.guard_daily_task_update();

create function public.guard_initiative_log()
returns trigger language plpgsql set search_path = '' as $$
declare activity public.initiative_activities;
begin
  if tg_op = 'INSERT' then
    select * into activity from public.initiative_activities
      where id = new.activity_id and family_id = new.family_id and active;
    if activity.id is null then raise exception 'Atividade indisponível'; end if;
    new.child_id := (select auth.uid());
    new.family_id := public.current_family_id();
    new.log_date := (now() at time zone 'America/Sao_Paulo')::date;
    new.proposed_minutes := activity.minutes;
    new.approved_minutes := null;
    new.status := 'pendente';
    new.mom_note := null;
    new.reviewed_at := null;
    if (select count(*) from public.initiative_logs
        where child_id = new.child_id and activity_id = new.activity_id
          and log_date = new.log_date and status <> 'recusado') >= activity.max_per_day then
      raise exception 'Limite diário desta iniciativa atingido';
    end if;
  elsif not public.is_responsavel() then
    new.family_id := old.family_id;
    new.child_id := old.child_id;
    new.activity_id := old.activity_id;
    new.log_date := old.log_date;
    new.proposed_minutes := old.proposed_minutes;
    new.approved_minutes := old.approved_minutes;
    new.mom_note := old.mom_note;
    new.reviewed_at := old.reviewed_at;
    new.status := 'pendente';
  end if;
  return new;
end $$;
revoke all on function public.guard_initiative_log() from public, anon, authenticated;
create trigger guard_initiative before insert or update on public.initiative_logs
  for each row execute function public.guard_initiative_log();

create function public.review_initiative(
  initiative_id uuid,
  decision public.review_status,
  approved integer default null,
  note text default null
) returns public.initiative_logs
language plpgsql security definer set search_path = '' as $$
declare
  item public.initiative_logs;
  settings public.screen_time_settings;
  credited integer;
  used_extra integer;
begin
  if not public.is_responsavel() then raise exception 'Apenas a responsável pode revisar'; end if;
  if decision not in ('aprovado','recusado','correcao') then raise exception 'Decisão inválida'; end if;
  select * into item from public.initiative_logs where id = initiative_id for update;
  if item.id is null or item.family_id <> public.current_family_id() then raise exception 'Registro não encontrado'; end if;
  if item.status <> 'pendente' then raise exception 'Registro já revisado'; end if;

  credited := 0;
  if decision = 'aprovado' then
    select * into settings from public.screen_time_settings where family_id = item.family_id;
    select coalesce(sum(minutes), 0) into used_extra from public.screen_time_ledger
      where child_id = item.child_id and event_date = item.log_date and event_type = 'iniciativa';
    credited := greatest(0, least(coalesce(approved, item.proposed_minutes), settings.max_extra_minutes - used_extra));
    if credited > 0 then
      insert into public.screen_time_ledger(family_id, child_id, event_date, event_type, minutes, source_id, note, created_by)
      values (item.family_id, item.child_id, item.log_date, 'iniciativa', credited, item.id, note, (select auth.uid()));
    end if;
  end if;

  update public.initiative_logs set
    status = decision,
    approved_minutes = case when decision = 'aprovado' then credited else null end,
    mom_note = note,
    reviewed_at = now()
  where id = item.id returning * into item;
  return item;
end $$;
revoke all on function public.review_initiative(uuid, public.review_status, integer, text) from public, anon;
grant execute on function public.review_initiative(uuid, public.review_status, integer, text) to authenticated;

alter table public.families enable row level security;
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.daily_tasks enable row level security;
alter table public.screen_time_settings enable row level security;
alter table public.initiative_activities enable row level security;
alter table public.initiative_logs enable row level security;
alter table public.school_logs enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.screen_time_ledger enable row level security;

create policy family_read on public.families for select to authenticated
  using (id = (select public.current_family_id()));
create policy family_profiles_read on public.profiles for select to authenticated
  using (family_id = (select public.current_family_id()));

create policy family_tasks_read on public.tasks for select to authenticated
  using (family_id = (select public.current_family_id()));
create policy mom_tasks_write on public.tasks for all to authenticated
  using (family_id = (select public.current_family_id()) and (select public.is_responsavel()))
  with check (family_id = (select public.current_family_id()) and (select public.is_responsavel()));

create policy family_daily_read on public.daily_tasks for select to authenticated
  using (family_id = (select public.current_family_id()));
create policy child_daily_update on public.daily_tasks for update to authenticated
  using (child_id = (select auth.uid()) and status = 'pendente')
  with check (child_id = (select auth.uid()) and status = 'aguardando');
create policy mom_daily_write on public.daily_tasks for all to authenticated
  using (family_id = (select public.current_family_id()) and (select public.is_responsavel()))
  with check (family_id = (select public.current_family_id()) and (select public.is_responsavel()));

create policy family_settings_read on public.screen_time_settings for select to authenticated
  using (family_id = (select public.current_family_id()));
create policy mom_settings_write on public.screen_time_settings for all to authenticated
  using (family_id = (select public.current_family_id()) and (select public.is_responsavel()))
  with check (family_id = (select public.current_family_id()) and (select public.is_responsavel()));

create policy family_activities_read on public.initiative_activities for select to authenticated
  using (family_id = (select public.current_family_id()));
create policy mom_activities_write on public.initiative_activities for all to authenticated
  using (family_id = (select public.current_family_id()) and (select public.is_responsavel()))
  with check (family_id = (select public.current_family_id()) and (select public.is_responsavel()));

create policy initiative_read on public.initiative_logs for select to authenticated
  using (family_id = (select public.current_family_id()) and (child_id = (select auth.uid()) or (select public.is_responsavel())));
create policy child_initiative_insert on public.initiative_logs for insert to authenticated
  with check (child_id = (select auth.uid()) and family_id = (select public.current_family_id()) and status = 'pendente');
create policy child_initiative_correct on public.initiative_logs for update to authenticated
  using (child_id = (select auth.uid()) and status = 'correcao')
  with check (child_id = (select auth.uid()) and status = 'pendente');
create policy mom_initiative_write on public.initiative_logs for all to authenticated
  using (family_id = (select public.current_family_id()) and (select public.is_responsavel()))
  with check (family_id = (select public.current_family_id()) and (select public.is_responsavel()));

create policy school_read on public.school_logs for select to authenticated
  using (family_id = (select public.current_family_id()) and (child_id = (select auth.uid()) or (select public.is_responsavel())));
create policy child_school_insert on public.school_logs for insert to authenticated
  with check (child_id = (select auth.uid()) and family_id = (select public.current_family_id()) and status = 'pendente');
create policy child_school_update on public.school_logs for update to authenticated
  using (child_id = (select auth.uid()) and log_date = ((now() at time zone 'America/Sao_Paulo')::date))
  with check (child_id = (select auth.uid()) and family_id = (select public.current_family_id()) and status = 'pendente');
create policy mom_school_write on public.school_logs for all to authenticated
  using (family_id = (select public.current_family_id()) and (select public.is_responsavel()))
  with check (family_id = (select public.current_family_id()) and (select public.is_responsavel()));

create policy checkin_read on public.daily_checkins for select to authenticated
  using (family_id = (select public.current_family_id()) and (child_id = (select auth.uid()) or (select public.is_responsavel())));
create policy child_checkin_insert on public.daily_checkins for insert to authenticated
  with check (child_id = (select auth.uid()) and family_id = (select public.current_family_id()) and status = 'pendente');
create policy child_checkin_update on public.daily_checkins for update to authenticated
  using (child_id = (select auth.uid()) and log_date = ((now() at time zone 'America/Sao_Paulo')::date))
  with check (child_id = (select auth.uid()) and family_id = (select public.current_family_id()) and status = 'pendente');
create policy mom_checkin_write on public.daily_checkins for all to authenticated
  using (family_id = (select public.current_family_id()) and (select public.is_responsavel()))
  with check (family_id = (select public.current_family_id()) and (select public.is_responsavel()));

create policy ledger_read on public.screen_time_ledger for select to authenticated
  using (family_id = (select public.current_family_id()) and (child_id = (select auth.uid()) or (select public.is_responsavel())));
create policy mom_ledger_write on public.screen_time_ledger for all to authenticated
  using (family_id = (select public.current_family_id()) and (select public.is_responsavel()))
  with check (family_id = (select public.current_family_id()) and (select public.is_responsavel()));

grant select on public.families, public.profiles, public.tasks, public.daily_tasks,
  public.screen_time_settings, public.initiative_activities, public.initiative_logs,
  public.school_logs, public.daily_checkins, public.screen_time_ledger to authenticated;
grant insert, update, delete on public.tasks, public.daily_tasks, public.screen_time_settings,
  public.initiative_activities, public.initiative_logs, public.school_logs,
  public.daily_checkins, public.screen_time_ledger to authenticated;

-- Prevent future objects from becoming browser-accessible by accident.
alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

