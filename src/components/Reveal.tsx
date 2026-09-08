import type { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

type RevealTag = "div" | "section" | "article" | "header" | "span";

interface RevealProps {
  children: ReactNode;
  as?: RevealTag;
  delay?: number;
  className?: string;
  /** "up" (padrão) sobe suavemente; "none" só faz fade, sem deslocamento. */
  direction?: "up" | "none";
}

/**
 * Envolve qualquer bloco e revela com fade + slide-up sutil quando entra na
 * tela. Usado nas seções da Home para a sensação cinematográfica de scroll.
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  className = "",
  direction = "up",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const style = {
    opacity: inView ? 1 : 0,
    transform: inView
      ? "translateY(0)"
      : direction === "up"
        ? "translateY(28px)"
        : "none",
    transition:
      "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)",
    transitionDelay: `${delay}ms`,
    willChange: "opacity, transform",
  } as const;

  switch (as) {
    case "section":
      return (
        <section ref={ref} className={className} style={style}>
          {children}
        </section>
      );
    case "article":
      return (
        <article ref={ref} className={className} style={style}>
          {children}
        </article>
      );
    case "header":
      return (
        <header ref={ref} className={className} style={style}>
          {children}
        </header>
      );
    case "span":
      return (
        <span ref={ref as never} className={className} style={style}>
          {children}
        </span>
      );
    default:
      return (
        <div ref={ref} className={className} style={style}>
          {children}
        </div>
      );
  }
}
