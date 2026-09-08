import { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  posterUrl: string;
  className?: string;
}

/**
 * Vídeo de fundo do Hero (van Matheus Tur na estrada).
 *
 * Como colocar o vídeo:
 *   - Vídeo principal (paisagem):  /public/videos/matheus-tur.mp4
 *   - Versão vertical opcional para celular:  /public/videos/matheus-tur-mobile.mp4
 *     (se esse arquivo não existir, o navegador simplesmente ignora essa fonte
 *     e usa o vídeo principal com object-cover — nada quebra.)
 *
 * Enquanto o arquivo não estiver em /public/videos/matheus-tur.mp4, o
 * navegador exibe apenas a imagem `posterUrl` (a foto da van), então o Hero
 * nunca fica quebrado ou em branco.
 */
export function HeroVideo({ posterUrl, className = "" }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoAvailable, setVideoAvailable] = useState(true);

  // Pausa o vídeo quando ele sai da tela (economiza bateria/CPU) e retoma ao voltar.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          el.play().catch(() => {
            /* autoplay pode ser bloqueado antes da 1ª interação — sem problema, o poster cobre isso */
          });
        } else {
          el.pause();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-black ${className}`}>
      {videoAvailable && (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="metadata"
          poster={posterUrl}
          onError={() => setVideoAvailable(false)}
          aria-hidden="true"
        >
          <source
            src="/videos/matheus-tur-mobile.mp4"
            media="(max-width: 767px)"
            type="video/mp4"
          />
          <source src="/videos/matheus-tur.mp4" type="video/mp4" />
        </video>
      )}
      {!videoAvailable && (
        <img
          src={posterUrl}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
