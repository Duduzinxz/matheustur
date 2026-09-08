import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "matheustur-theme";

export type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  // O padrão do site é escuro; só troca se a pessoa já escolheu claro antes.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial: Theme = saved === "light" ? "light" : "dark";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
      title={theme === "dark" ? "Tema claro" : "Tema escuro"}
      className={`grid size-10 place-items-center rounded-md border border-border text-silver transition-colors hover:text-tur-green ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="size-5" strokeWidth={2} />
      ) : (
        <Moon className="size-5" strokeWidth={2} />
      )}
    </button>
  );
}
