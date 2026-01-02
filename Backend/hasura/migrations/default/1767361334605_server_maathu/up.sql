INSERT INTO public.users (id, email, display_name, password_hash)
VALUES ('00000000-0000-0000-0000-000000000001', 'mathu@mathu.com', 'Mathu AI', 'system_user_do_not_login')
ON CONFLICT (id) DO NOTHING;
