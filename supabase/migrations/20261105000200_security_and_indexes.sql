revoke all on function public.current_family_id() from anon;
revoke all on function public.is_responsavel() from anon;

create index daily_checkins_family_idx on public.daily_checkins(family_id);
create index daily_tasks_family_child_idx on public.daily_tasks(family_id, child_id);
create index initiative_activities_family_idx on public.initiative_activities(family_id);
create index initiative_logs_family_child_idx on public.initiative_logs(family_id, child_id);
create index initiative_logs_activity_idx on public.initiative_logs(activity_id);
create index school_logs_family_idx on public.school_logs(family_id);
create index screen_time_ledger_family_child_date_idx on public.screen_time_ledger(family_id, child_id, event_date);
create index screen_time_ledger_created_by_idx on public.screen_time_ledger(created_by);
create index tasks_family_idx on public.tasks(family_id);
