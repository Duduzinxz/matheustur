CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed text[] := ARRAY['matheuspbotaro@gmail.com', 'botaroeduardo1@gmail.com'];
BEGIN
  IF lower(coalesce(NEW.email, '')) = ANY (allowed) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Cadastro nao permitido para este e-mail.';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM anon, authenticated, public;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN ('matheuspbotaro@gmail.com', 'botaroeduardo1@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;