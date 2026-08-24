"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useDDSItem } from "@/hooks";
import { DDS_PDF_PAGE_DWELL_MS, DDS_VISIBILITY_RATIO } from "@/lib/constants";
import type { PdfViewerProps } from "@/lib/types";
import { SeenBadge } from "@/components/dds/SeenBadge";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

export function PdfViewer({ id, label, src }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [seenPages, setSeenPages] = useState<Set<number>>(new Set());
  const visibleSinceRef = useRef<Map<number, number>>(new Map());
  const { item, markProgress, markSeen } = useDDSItem(id, label, "pdf");

  // Tracks each page individually so scrolling fast past the middle of the
  // document doesn't count as "read" — every page needs its own dwell time
  // in view, not just reaching the bottom of the scroll container.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || numPages === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const pageNumber = Number((entry.target as HTMLElement).dataset.pageNumber);
          if (entry.isIntersecting) {
            if (!visibleSinceRef.current.has(pageNumber)) {
              visibleSinceRef.current.set(pageNumber, Date.now());
            }
          } else {
            visibleSinceRef.current.delete(pageNumber);
          }
        }
      },
      { root: container, threshold: DDS_VISIBILITY_RATIO },
    );

    // react-pdf's own Page root div already carries data-page-number; scope
    // to it (.react-pdf__Page) so we don't also match our caption wrapper.
    container.querySelectorAll<HTMLElement>(".react-pdf__Page[data-page-number]").forEach((el) => observer.observe(el));

    let rafId: number;
    const tick = () => {
      const now = Date.now();
      setSeenPages((prev) => {
        let next = prev;
        for (const [pageNumber, since] of visibleSinceRef.current) {
          if (!prev.has(pageNumber) && now - since >= DDS_PDF_PAGE_DWELL_MS) {
            if (next === prev) next = new Set(prev);
            next.add(pageNumber);
          }
        }
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [numPages]);

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
      <div ref={containerRef} className="h-96 overflow-y-auto bg-neutral-100 dark:bg-neutral-950">
        <Document
          file={src}
          onLoadSuccess={({ numPages: total }) => setNumPages(total)}
          loading={<p className="p-4 text-sm text-neutral-500">Carregando PDF...</p>}
          className="flex flex-col items-center gap-2 py-2"
        >
          {Array.from({ length: numPages }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <div key={pageNumber} className="flex flex-col items-center gap-1">
                <Page pageNumber={pageNumber} width={480} className="shadow" />
                <span
                  className={
                    seenPages.has(pageNumber)
                      ? "text-xs font-medium text-green-600 dark:text-green-400"
                      : "text-xs text-neutral-400"
                  }
                >
                  {seenPages.has(pageNumber) ? `✓ página ${pageNumber} visualizada` : `página ${pageNumber}`}
                </span>
              </div>
            );
          })}
        </Document>
      </div>
      <p className="px-4 py-2 text-xs text-neutral-500">
        {seenPages.size} de {numPages || "…"} páginas visualizadas. Cada página precisa ficar visível por um
        instante — passar rápido pelo meio do documento não conta.
      </p>
    </div>
  );
}
