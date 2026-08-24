"use client";

import Link from "next/link";
import { useState } from "react";
import { DDSProvider, DDSGate, TextViewer } from "@/components";

export default function TextDemo() {
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← voltar
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">DDS — Texto</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Confirma como &quot;visualizado&quot; só depois de rolar o texto até o final.
        </p>
      </header>

      <DDSProvider>
        <DDSGate onConfirm={() => setConfirmedAt(new Date().toLocaleString("pt-BR"))}>
          <TextViewer id="texto-termos" label="Texto — Termos de ciência">
            <p className="mb-3">
              Declaro estar ciente das políticas internas apresentadas neste documento, incluindo procedimentos de
              segurança, uso de equipamentos e conduta esperada durante as atividades.
            </p>
            <p className="mb-3">
              Este texto simula um conteúdo mais longo, exigindo rolagem até o final para que a leitura seja
              considerada completa. Em um cenário real, aqui entrariam os termos completos do treinamento ou
              política interna da empresa.
            </p>
            <p className="mb-3">
              Continue rolando para visualizar o restante do conteúdo. A confirmação de leitura só é registrada
              quando o final deste bloco se torna visível.
            </p>
            <p>Fim do documento — leitura concluída.</p>
          </TextViewer>
        </DDSGate>
      </DDSProvider>

      {confirmedAt && (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
          Ciência registrada em {confirmedAt}.
        </p>
      )}
    </div>
  );
}
