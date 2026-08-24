"use client";

import Link from "next/link";
import { useState } from "react";
import { DDSProvider, DDSGate, VideoViewer } from "@/components";

export default function VideoDemo() {
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← voltar
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">DDS — Vídeo</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Confirma como &quot;visualizado&quot; só ao assistir até o fim. Arrastar a barra pra frente sem assistir
          não funciona — o vídeo volta pro ponto realmente assistido. O vídeo é servido de{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-800">
            localhost:4321
          </code>{" "}
          — origem diferente do app (<code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-800">localhost:3000</code>),
          simulando um CDN externo. O rastreamento de progresso funciona igual porque os eventos nativos do{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-800">&lt;video&gt;</code> não
          são bloqueados por CORS. Rode <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-800">npm run mock:video-cdn</code>{" "}
          antes de abrir esta página.
        </p>
      </header>

      <DDSProvider>
        <DDSGate onConfirm={() => setConfirmedAt(new Date().toLocaleString("pt-BR"))}>
          <VideoViewer
            id="video-treinamento"
            label="Vídeo — Treinamento"
            src="http://localhost:4321/sample-dds.mp4"
          />
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
