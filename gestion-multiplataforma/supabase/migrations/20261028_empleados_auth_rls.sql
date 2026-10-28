alter table public.empleados enable row level security;

-- Replace existing policies so no earlier permissive policy can bypass this baseline.
do $$
declare
  politica record;
begin
  for politica in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'empleados'
  loop
    execute format('drop policy %I on public.empleados', politica.policyname);
  end loop;
end
$$;

create or replace function public.es_admin_empleados()
returns boolean
language sql
stable
security definer
set search_path = ''
set row_security = off
as $$
  select exists (
    select 1
    from public.empleados as empleado
    where lower(empleado.email) = lower((select auth.jwt() ->> 'email'))
      and empleado.rol = 'Admin'
  );
$$;

revoke all on function public.es_admin_empleados() from public, anon;
grant execute on function public.es_admin_empleados() to authenticated;

revoke all on table public.empleados from anon;
grant select, insert, update, delete on table public.empleados to authenticated;

create policy empleados_select_propios_o_admin
on public.empleados
for select
to authenticated
using (
  lower(email) = lower((select auth.jwt() ->> 'email'))
  or (select public.es_admin_empleados())
);

create policy empleados_insert_admin
on public.empleados
for insert
to authenticated
with check ((select public.es_admin_empleados()));

create policy empleados_update_admin
on public.empleados
for update
to authenticated
using ((select public.es_admin_empleados()))
with check ((select public.es_admin_empleados()));

create policy empleados_delete_admin
on public.empleados
for delete
to authenticated
using ((select public.es_admin_empleados()));

-- Passwords are now handled only by Supabase Auth.
alter table public.empleados
  drop column if exists contraseña;
