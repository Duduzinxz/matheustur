CREATE OR REPLACE FUNCTION public.km_registro_apply()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE anterior integer;
BEGIN
  SELECT km INTO anterior FROM public.km_registros
  WHERE veiculo_id = NEW.veiculo_id
    AND (data < NEW.data OR (data = NEW.data AND created_at < coalesce(NEW.created_at, now())))
  ORDER BY data DESC, created_at DESC LIMIT 1;

  IF anterior IS NULL THEN
    SELECT km_atual INTO anterior FROM public.veiculos WHERE id = NEW.veiculo_id;
  END IF;

  NEW.km_rodados := GREATEST(coalesce(NEW.km - anterior, 0), 0);
  RETURN NEW;
END; $$;

REVOKE ALL ON FUNCTION public.km_registro_apply() FROM anon, authenticated, public;