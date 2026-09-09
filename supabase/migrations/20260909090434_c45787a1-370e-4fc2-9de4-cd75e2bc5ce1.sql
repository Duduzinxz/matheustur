GRANT SELECT, INSERT, UPDATE, DELETE ON public.solicitacoes TO authenticated;
GRANT INSERT ON public.solicitacoes TO anon;
GRANT ALL ON public.solicitacoes TO service_role;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;