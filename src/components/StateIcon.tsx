type StateUf = "MG" | "SP" | "RJ" | "ES";

const commonProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Ilustrações de linha originais e minimalistas — sem uso de fotos de terceiros. */
export function StateIcon({
  uf,
  color,
  className,
}: {
  uf: StateUf;
  color: string;
  className?: string;
}) {
  switch (uf) {
    case "MG":
      // Serras / montanhas de Minas
      return (
        <svg {...commonProps} className={className} stroke={color}>
          <path d="M4 46 L18 24 L27 36 L36 18 L48 40 L60 30 L60 46 Z" />
          <circle cx="46" cy="16" r="5" />
        </svg>
      );
    case "SP":
      // Skyline de edifícios
      return (
        <svg {...commonProps} className={className} stroke={color}>
          <path d="M6 48 V30 H16 V48" />
          <path d="M20 48 V18 H32 V48" />
          <path d="M36 48 V26 H46 V48" />
          <path d="M50 48 V12 H58 V48" />
          <path d="M4 48 H60" />
        </svg>
      );
    case "RJ":
      // Cristo Redentor estilizado + Pão de Açúcar
      return (
        <svg {...commonProps} className={className} stroke={color}>
          <path d="M32 12 V30 M20 20 L32 15 L44 20" />
          <path d="M24 30 H40 L36 44 H28 Z" />
          <path d="M4 48 Q16 34 24 48" />
          <path d="M40 48 H60" />
        </svg>
      );
    case "ES":
      // Ondas / litoral
      return (
        <svg {...commonProps} className={className} stroke={color}>
          <path d="M4 24 Q12 16 20 24 T36 24 T52 24 T60 24" />
          <path d="M4 38 Q12 30 20 38 T36 38 T52 38 T60 38" />
          <path d="M4 50 Q12 42 20 50 T36 50 T52 50 T60 50" />
        </svg>
      );
  }
}
