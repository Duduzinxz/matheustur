-- VEICULOS
CREATE TABLE public.veiculos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  numero text,
  placa text,
  marca text,
  modelo text,
  ano integer,
  tipo text NOT NULL DEFAULT 'van',
  km_atual integer NOT NULL DEFAULT 0,
  data_aquisicao date,
  status text NOT NULL DEFAULT 'ativo',
  intervalo_oleo_km integer NOT NULL DEFAULT 10000,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.veiculos TO authenticated;
GRANT ALL ON public.veiculos TO service_role;
ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage veiculos" ON public.veiculos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- KM REGISTROS
CREATE TABLE public.km_registros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veiculo_id uuid NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  data date NOT NULL DEFAULT current_date,
  km integer NOT NULL,
  km_rodados integer NOT NULL DEFAULT 0,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX km_registros_veiculo_idx ON public.km_registros (veiculo_id, data DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.km_registros TO authenticated;
GRANT ALL ON public.km_registros TO service_role;
ALTER TABLE public.km_registros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage km_registros" ON public.km_registros FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ABASTECIMENTOS
CREATE TABLE public.abastecimentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veiculo_id uuid NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  data date NOT NULL DEFAULT current_date,
  km integer,
  litros numeric(10,3) NOT NULL DEFAULT 0,
  valor_total numeric(12,2) NOT NULL DEFAULT 0,
  preco_litro numeric(10,3),
  posto text,
  combustivel text,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX abastecimentos_veiculo_idx ON public.abastecimentos (veiculo_id, data DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.abastecimentos TO authenticated;
GRANT ALL ON public.abastecimentos TO service_role;
ALTER TABLE public.abastecimentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage abastecimentos" ON public.abastecimentos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- MANUTENCOES
CREATE TABLE public.manutencoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veiculo_id uuid NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  data date NOT NULL DEFAULT current_date,
  km integer,
  tipo text NOT NULL DEFAULT 'outros',
  descricao text,
  valor numeric(12,2) NOT NULL DEFAULT 0,
  fornecedor text,
  proximo_km integer,
  proxima_data date,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX manutencoes_veiculo_idx ON public.manutencoes (veiculo_id, data DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manutencoes TO authenticated;
GRANT ALL ON public.manutencoes TO service_role;
ALTER TABLE public.manutencoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage manutencoes" ON public.manutencoes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PNEUS
CREATE TABLE public.pneus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veiculo_id uuid NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  posicao text NOT NULL DEFAULT 'dianteiro esquerdo',
  marca text,
  modelo text,
  medida text,
  valor numeric(12,2) NOT NULL DEFAULT 0,
  quantidade integer NOT NULL DEFAULT 1,
  data_instalacao date NOT NULL DEFAULT current_date,
  km_instalacao integer NOT NULL DEFAULT 0,
  data_retirada date,
  km_retirada integer,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pneus_veiculo_idx ON public.pneus (veiculo_id, data_instalacao DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pneus TO authenticated;
GRANT ALL ON public.pneus TO service_role;
ALTER TABLE public.pneus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage pneus" ON public.pneus FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- DESPESAS
CREATE TABLE public.despesas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veiculo_id uuid NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  data date NOT NULL DEFAULT current_date,
  categoria text NOT NULL DEFAULT 'outros',
  valor numeric(12,2) NOT NULL DEFAULT 0,
  km integer,
  descricao text,
  comprovante_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX despesas_veiculo_idx ON public.despesas (veiculo_id, data DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.despesas TO authenticated;
GRANT ALL ON public.despesas TO service_role;
ALTER TABLE public.despesas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage despesas" ON public.despesas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SERVICOS
CREATE TABLE public.servicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veiculo_id uuid NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  data date NOT NULL DEFAULT current_date,
  tipo text NOT NULL DEFAULT 'fretamento',
  cliente text,
  valor numeric(12,2) NOT NULL DEFAULT 0,
  km_inicial integer,
  km_final integer,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX servicos_veiculo_idx ON public.servicos (veiculo_id, data DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.servicos TO authenticated;
GRANT ALL ON public.servicos TO service_role;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage servicos" ON public.servicos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at para veiculos
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_veiculos_updated_at BEFORE UPDATE ON public.veiculos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- calcula km_rodados e atualiza km_atual do veiculo
CREATE OR REPLACE FUNCTION public.km_registro_apply()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE anterior integer;
BEGIN
  SELECT km INTO anterior FROM public.km_registros
  WHERE veiculo_id = NEW.veiculo_id AND (data < NEW.data OR (data = NEW.data AND created_at < coalesce(NEW.created_at, now())))
  ORDER BY data DESC, created_at DESC LIMIT 1;

  NEW.km_rodados := GREATEST(coalesce(NEW.km - anterior, 0), 0);
  RETURN NEW;
END; $$;

CREATE TRIGGER km_registro_before BEFORE INSERT ON public.km_registros
FOR EACH ROW EXECUTE FUNCTION public.km_registro_apply();

CREATE OR REPLACE FUNCTION public.bump_veiculo_km()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.km IS NOT NULL THEN
    UPDATE public.veiculos SET km_atual = GREATEST(km_atual, NEW.km) WHERE id = NEW.veiculo_id;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER km_registro_after AFTER INSERT ON public.km_registros
FOR EACH ROW EXECUTE FUNCTION public.bump_veiculo_km();

CREATE TRIGGER abastecimento_bump_km AFTER INSERT ON public.abastecimentos
FOR EACH ROW EXECUTE FUNCTION public.bump_veiculo_km();

CREATE TRIGGER manutencao_bump_km AFTER INSERT ON public.manutencoes
FOR EACH ROW EXECUTE FUNCTION public.bump_veiculo_km();