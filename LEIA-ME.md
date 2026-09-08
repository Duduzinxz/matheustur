# Redesign Matheus Tur — o que mudou e como aplicar

## O que foi feito

- **Home totalmente redesenhada**: hero em vídeo (a van na estrada), navbar
  premium com efeito de transparência/blur ao rolar, seção de serviços em
  formato editorial (sem cards genéricos), seção "Sobre nós / Por que
  Matheus Tur" com composição assimétrica, seção de destinos (MG/SP/RJ/ES) e
  CTA final de simulação.
- **Simulação de viagem preservada 100%**: nenhuma lógica de cálculo de
  quilometragem, envio pro WhatsApp ou integração com Supabase foi alterada.
  Só o espaçamento do topo mudou (para não ficar embaixo da navbar fixa).
- **WhatsApp continua em todos os pontos**: navbar, hero, seção final e botão
  flutuante (que já existia e foi mantido).
- **Animações discretas de entrada em scroll** (fade + slide-up) usando
  IntersectionObserver — sem bibliotecas novas.
- **SEO preservado/ajustado**: título "Matheus Tur | Turismo e Transporte em
  Ubá MG" e meta description atualizada.
- Testado com `tsc --noEmit`, `eslint` e `vite build` — build 100% limpo.

## Arquivos novos

```
src/components/Navbar.tsx
src/components/Footer.tsx
src/components/HeroVideo.tsx
src/components/Reveal.tsx
src/components/home/Hero.tsx
src/components/home/ServicesSection.tsx
src/components/home/WhyUsSection.tsx
src/components/home/DestinationsSection.tsx
src/components/home/SimulationCTA.tsx
src/hooks/use-in-view.tsx
public/videos/matheus-tur.mp4   ← o vídeo que você enviou, já no lugar certo
```

## Arquivos alterados (substitua pelo conteúdo daqui)

```
src/routes/__root.tsx        (navbar/footer novos + SEO)
src/routes/index.tsx         (Home recomposta com as novas seções)
src/routes/simulacao.tsx     (só o espaçamento do topo mudou)
src/routes/auth.tsx          (só o espaçamento do topo mudou)
src/routes/_authenticated/painel.tsx  (só o espaçamento do topo mudou)
```

## Como aplicar no GitHub (sem git local)

Repita para cada arquivo da lista "novos" e "alterados": abra a pasta
correspondente em `matheustur-viajarfacil-main/...` no GitHub, clique em
**Add file → Upload files**, arraste o arquivo com o mesmo nome/pasta e
confirme o commit. Para os arquivos "alterados", subir com o mesmo nome
substitui o conteúdo automaticamente.

Ordem sugerida:
1. Suba os arquivos novos (Navbar.tsx, Footer.tsx, HeroVideo.tsx, Reveal.tsx,
   use-in-view.tsx e a pasta `home/` inteira).
2. Suba `public/videos/matheus-tur.mp4` (crie a pasta `videos` dentro de
   `public` ao enviar).
3. Por último, substitua `__root.tsx`, `index.tsx`, `simulacao.tsx`,
   `auth.tsx` e `painel.tsx` — só depois que os componentes novos já
   existirem, senão o build vai quebrar por import não encontrado.
4. Commit direto na `main`. A Vercel refaz o deploy sozinha.

## Vídeo mobile (opcional)

Se um dia você tiver uma versão vertical do vídeo, é só subir o arquivo em
`public/videos/matheus-tur-mobile.mp4` — o código já está preparado para
usá-lo automaticamente em telas de celular, sem precisar mexer em nada.
