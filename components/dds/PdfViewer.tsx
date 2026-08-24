"use client";

import { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useDDSItem, useDwellVisibility } from "@/hooks";
import { DDS_PDF_PAGE_DWELL_MS } from "@/lib/constants";
import type { PdfPageProps, PdfViewerProps } from "@/lib/types";
import { SeenBadge } from "@/components/dds/SeenBadge";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

function PdfPage({ pageNumber, seen, onSeen, scrollRoot }: PdfPageProps) {
  const ref = useDwellVisibility(
    DDS_PDF_PAGE_DWELL_MS,
    () => {},
    () => onSeen(pageNumber),
    { root: scrollRoot },
  );

  return (
    <div className="flex flex-col items-center gap-1">
      <div ref={ref}>
        <Page pageNumber={pageNumber} width={480} className="shadow" />
      </div>
      <span
        className={seen ? "text-xs font-medium text-green-600 dark:text-green-400" : "text-xs text-neutral-400"}
      >
        {seen ? `✓ página ${pageNumber} visualizada` : `página ${pageNumber}`}
      </span>
    </div>
  );
}

export function PdfViewer({ id, label, src }: PdfViewerProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [seenPages, setSeenPages] = useState<Set<number>>(new Set());
  const { item, markProgress, markSeen } = useDDSItem(id, label, "pdf");

  const handlePageSeen = useCallback((pageNumber: number) => {
    setSeenPages((prev) => (prev.has(pageNumber) ? prev : new Set(prev).add(pageNumber)));
  }, []);

  useEffect(() => {
    if (numPages === 0) return;
    markProgress(seenPages.size / numPages);
    if (seenPages.size === numPages) markSeen();
  }, [seenPages, numPages, markProgress, markSeen]);

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <span className="text-sm font-medium">{label}</span>
        <SeenBadge seen={item?.seen ?? false} progress={item?.progress ?? 0} />
      </div>
      <div ref={setContainer} className="h-96 overflow-y-auto bg-neutral-100 dark:bg-neutral-950">
        <Document
          file={src}
          onLoadSuccess={({ numPages: total }) => setNumPages(total)}
          loading={<p className="p-4 text-sm text-neutral-500">Carregando PDF...</p>}
          className="flex flex-col items-center gap-2 py-2"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <PdfPage
              key={i + 1}
              pageNumber={i + 1}
              seen={seenPages.has(i + 1)}
              onSeen={handlePageSeen}
              scrollRoot={container}
            />
          ))}
        </Document>
      </div>
      <p className="px-4 py-2 text-xs text-neutral-500">
        {seenPages.size} de {numPages || "…"} páginas visualizadas. Cada página precisa ficar visível por um
        instante — passar rápido pelo meio do documento não conta.
      </p>
    </div>
  );
}
