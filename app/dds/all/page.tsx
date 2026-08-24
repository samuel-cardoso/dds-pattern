"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { DDSProvider, DDSGate, ImageViewer, VideoViewer, TextViewer, SampleTermsContent } from "@/components";

const PdfViewer = dynamic(() => import("@/components/dds/PdfViewer").then((mod) => mod.PdfViewer), {
  ssr: false,
  loading: () => <p className="p-4 text-sm text-neutral-500">Carregando visualizador de PDF...</p>,
});

export default function AllDemo() {
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← voltar
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">DDS — Todos os tipos</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Cada bloco só é marcado como &quot;visualizado&quot; quando o usuário efetivamente consome o conteúdo. O
          botão de confirmação só libera quando todos os itens estiverem visualizados.
        </p>
      </header>

      <DDSProvider>
        <DDSGate onConfirm={() => setConfirmedAt(new Date().toLocaleString("pt-BR"))}>
          <ImageViewer
            id="img-seguranca"
            label="Imagem — Instrução de segurança"
            src="https://picsum.photos/id/1080/900/500"
            alt="Instrução de segurança ilustrativa"
          />

          <VideoViewer
            id="video-treinamento"
            label="Vídeo — Treinamento"
            src="http://localhost:4321/sample-dds.mp4"
          />

          <PdfViewer id="pdf-manual" label="PDF — Manual do colaborador" src="/sample-dds.pdf" />

          <TextViewer id="texto-termos" label="Texto — Termos de ciência">
            <SampleTermsContent />
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
