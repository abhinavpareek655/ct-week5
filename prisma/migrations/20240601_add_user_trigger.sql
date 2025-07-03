-- Enhanced function to handle new user creation with metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public."User" (
    id,
    email,
    full_name,
    avatar_url,
    is_verified,
    subscription_type,
    last_login,
    country,
    timezone
  )
  values (
    new.id,
    new.email,
    (new.raw_user_meta_data->>'full_name'),
    (new.raw_user_meta_data->>'avatar_url'),
    coalesce((new.raw_user_meta_data->>'is_verified')::boolean, false),
    coalesce((new.raw_user_meta_data->>'subscription_type'), 'free'),
    (new.raw_user_meta_data->>'last_login')::timestamptz,
    (new.raw_user_meta_data->>'country'),
    (new.raw_user_meta_data->>'timezone')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();