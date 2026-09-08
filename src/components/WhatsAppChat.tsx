import { useState } from "react";
import logoUrl from "@/assets/logo-matheus-tur.png";

const WHATSAPP_NUMBER = "5532999036855";

const QUICK_QUESTIONS = [
  "Quero um orçamento para uma viagem",
  "Vocês têm van disponível para essa data?",
  "Quantos passageiros cabem no veículo?",
  "Fazem excursão para praia?",
];

function waLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border bg-secondary px-4 py-3">
            <img src={logoUrl} alt="Matheus Tur" className="h-8 w-auto" />
            <div className="flex-1">
              <p className="text-sm font-bold uppercase leading-tight">
                Fale com a gente
              </p>
              <p className="text-xs text-tur-green">
                Respondemos pelo WhatsApp
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar conversa"
              className="rounded-md px-2 py-1 text-lg leading-none text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>

          <div className="space-y-3 px-4 py-4">
            <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-3 py-2 text-sm">
              Olá! 👋 Aqui é a Matheus Tur. Escreva sua pergunta ou escolha uma
              opção abaixo — respondemos direto no WhatsApp.
            </p>

            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <a
                  key={q}
                  href={waLink(q)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-tur-green/50 px-3 py-1.5 text-xs font-semibold text-tur-green transition-colors hover:bg-tur-green/10"
                >
                  {q}
                </a>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Escreva sua mensagem..."
              className="w-full resize-none rounded-md border border-input bg-secondary px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-tur-green"
            />

            <a
              href={waLink(
                message.trim() ||
                  "Olá! Gostaria de mais informações sobre as viagens.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-tur-green px-4 py-3 text-sm font-bold uppercase tracking-wide text-tur-green-foreground transition-transform hover:scale-[1.02]"
            >
              Enviar no WhatsApp
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir conversa no WhatsApp"
        className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-md border border-border bg-tur-green px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-tur-green-foreground shadow-2xl transition-transform hover:scale-[1.03]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5 text-tur-green-foreground"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.422 7.481h-.004a9.311 9.311 0 01-4.51-1.165l-.323-.19-3.35.879.9-3.264-.209-.33a9.312 9.312 0 01-1.43-4.99c0-5.162 4.195-9.357 9.357-9.357 2.5 0 4.838.975 6.601 2.747a9.276 9.276 0 012.75 6.605c0 5.163-4.196 9.358-9.357 9.358M12.001.639C5.478.639.14 5.977.14 12.5c0 2.426.696 4.689 1.898 6.609L0 24l5.026-1.32a11.51 11.51 0 006.975 2.34c6.522 0 11.86-5.338 11.86-11.86S18.523.64 12 .64" />
        </svg>
        {open ? "Fechar" : "Fale no WhatsApp"}
      </button>
    </>
  );
}
