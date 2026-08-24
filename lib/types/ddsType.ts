import type { ReactNode } from "react";

export type DDSContentType = "image" | "video" | "pdf" | "text";

export interface DDSItemMeta {
  id: string;
  label: string;
  type: DDSContentType;
}

export interface DDSItemState extends DDSItemMeta {
  seen: boolean;
  progress: number;
}

export interface DDSContextValue {
  items: Record<string, DDSItemState>;
  register: (item: DDSItemMeta) => void;
  markProgress: (id: string, progress: number) => void;
  markSeen: (id: string) => void;
  isAllSeen: boolean;
}

export interface DDSProviderProps {
  children: ReactNode;
}

export interface DDSGateProps {
  children: ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
  confirmedLabel?: string;
}

export interface SeenBadgeProps {
  seen: boolean;
  progress: number;
}

export interface ImageViewerProps {
  id: string;
  label: string;
  src: string;
  alt: string;
  minDwellMs?: number;
}

export interface VideoViewerProps {
  id: string;
  label: string;
  src: string;
  completionThreshold?: number;
}

export interface PdfViewerProps {
  id: string;
  label: string;
  src: string;
}

export interface PdfPageProps {
  pageNumber: number;
  seen: boolean;
  onSeen: (pageNumber: number) => void;
  scrollRoot: Element | null;
}

export interface TextViewerProps {
  id: string;
  label: string;
  children: ReactNode;
}

export interface TextSentinelProps {
  index: number;
  onSeen: (index: number) => void;
  scrollRoot: Element | null;
}
