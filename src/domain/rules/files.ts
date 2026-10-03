/**
 * File rules: size labels and upload validation.
 *
 * Source: Angular `order-files.component.ts#addFiles` (order files) and
 * `sub-order.component.ts#handleScanFiles` (sub-order scan files).
 */

import type { SubOrderScanLocalFile } from '../models';

export const MAX_FILE_BYTES = 100 * 1024 * 1024;
export const MAX_FILES_PER_BATCH = 10;
export const MAX_FILES_PER_SCAN = 10;
export const ORDER_FILE_TYPES = ['STL', 'PLY', 'OBJ', 'JPG', 'PNG', 'PDF', 'DCM'] as const;

/** Minimal file shape so rules stay testable without the DOM `File`. */
export interface IncomingFile {
  name: string;
  size: number;
  type?: string;
  lastModified?: number;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${String(bytes)} B`;
  if (bytes < 1024 * 1024) return `${String(Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot < 0 || dot === name.length - 1 ? 'FILE' : name.slice(dot + 1).toUpperCase();
}

export interface OrderFileValidation {
  accepted: IncomingFile[];
  rejected: string[];
}

/**
 * Order files: first 10 of the batch; accepted types only; <= 100 MB;
 * no duplicate names (case-insensitive) against existing or earlier files.
 */
export function validateOrderFiles(
  files: readonly IncomingFile[],
  existingNames: readonly string[]
): OrderFileValidation {
  const seen = new Set(existingNames.map((name) => name.toLowerCase()));
  const accepted: IncomingFile[] = [];
  const rejected: string[] = [];
  for (const file of files.slice(0, MAX_FILES_PER_BATCH)) {
    const extension = fileExtension(file.name);
    if (!(ORDER_FILE_TYPES as readonly string[]).includes(extension)) {
      rejected.push(`${file.name}: unsupported file type`);
    } else if (file.size > MAX_FILE_BYTES) {
      rejected.push(`${file.name}: exceeds the 100 MB limit`);
    } else if (seen.has(file.name.toLowerCase())) {
      rejected.push(`${file.name}: duplicate file`);
    } else {
      seen.add(file.name.toLowerCase());
      accepted.push(file);
    }
  }
  return { accepted, rejected };
}

export interface ScanFileSelection {
  files: SubOrderScanLocalFile[];
  message: string;
}

/**
 * Sub-order scan files: at most 10 per requirement, <= 100 MB each,
 * duplicates detected by name + size. Returns the merged list and the
 * Angular status message.
 */
export function mergeScanFiles(
  current: readonly SubOrderScanLocalFile[],
  incoming: readonly IncomingFile[],
  scanLabel: string,
  now: string,
  makeId: () => string
): ScanFileSelection {
  if (incoming.length === 0) return { files: [...current], message: 'No files selected.' };
  const spaceLeft = MAX_FILES_PER_SCAN - current.length;
  if (spaceLeft <= 0) {
    return {
      files: [...current],
      message: `Maximum ${String(MAX_FILES_PER_SCAN)} files allowed for this requirement.`,
    };
  }
  const keys = new Set(current.map((file) => `${file.name}::${String(file.sizeBytes)}`));
  const files = [...current];
  let oversize = 0;
  let duplicates = 0;
  for (const file of incoming.slice(0, spaceLeft)) {
    const key = `${file.name}::${String(file.size)}`;
    if (file.size > MAX_FILE_BYTES) {
      oversize += 1;
    } else if (keys.has(key)) {
      duplicates += 1;
    } else {
      keys.add(key);
      files.push({
        id: makeId(),
        name: file.name,
        sizeBytes: file.size,
        sizeLabel: formatBytes(file.size),
        type: file.type || 'application/octet-stream',
        lastModified: file.lastModified ?? 0,
        selectedAt: now,
      });
    }
  }
  const added = files.length - current.length;
  const message =
    oversize === 0 && duplicates === 0
      ? `${String(added)} file(s) selected locally for ${scanLabel}.`
      : `Added ${String(added)} file(s). Skipped ${String(duplicates)} duplicate and ${String(oversize)} oversized file(s).`;
  return { files, message };
}

export type FileKind = 'image' | 'pdf' | 'scan' | 'other';

/** Angular file icons: images green, PDFs red, 3D scans / other blue. */
export function fileKind(type: string): FileKind {
  const upper = type.toUpperCase();
  if (upper === 'JPG' || upper === 'JPEG' || upper === 'PNG') return 'image';
  if (upper === 'PDF') return 'pdf';
  if (['STL', 'PLY', 'OBJ', 'DCM', 'DICOM'].includes(upper)) return 'scan';
  return 'other';
}

/** Text descriptor used for local "downloads" (no binary storage in the mock). */
export function fileDescriptor(fields: Record<string, string>): string {
  return Object.entries(fields)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}
