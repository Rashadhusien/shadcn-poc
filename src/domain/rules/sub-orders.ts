/**
 * Sub-order rules.
 *
 * Source: Angular `core/services/sub-order-data.service.ts`,
 * `orders.component.ts#subOrderProgress`, `sub-order.component.ts#progress`.
 */

import { DEFAULT_SUB_ORDER_FORM_VALUES } from '../catalog';
import type {
  Priority,
  SubOrder,
  SubOrderContextSnapshot,
  SubOrderCreationData,
  SubOrderDetail,
  SubOrderFormDraftValue,
  SubOrderFormItemStatus,
  SubOrderScanItem,
  SubOrderScanLocalFile,
  SubOrderStatus,
} from '../models';

export function isScanSatisfied(scan: SubOrderScanItem): boolean {
  return scan.status === 'uploaded' || scan.status === 'selected-local';
}

/** All forms and scans done -> done; any progress -> in-progress. */
export function deriveSubOrderStatus(
  formsTotal: number,
  formsComplete: number,
  scansTotal: number,
  scansComplete: number
): SubOrderStatus {
  const total = formsTotal + scansTotal;
  const done = formsComplete + scansComplete;
  if (total > 0 && done >= total) return 'done';
  if (done > 0) return 'in-progress';
  return 'pending';
}

/** Orders list / order view: average of forms and scans completion. */
export function subOrderProgress(subOrder: SubOrder): number {
  const forms = subOrder.formsTotal === 0 ? 1 : subOrder.formsComplete / subOrder.formsTotal;
  const scans = subOrder.scansTotal === 0 ? 1 : subOrder.scansComplete / subOrder.scansTotal;
  return Math.round(((forms + scans) / 2) * 100);
}

/** Sub-order page: done items over required items. */
export function detailProgress(detail: SubOrderDetail): number {
  const required =
    detail.forms.filter((form) => form.required).length +
    detail.scans.filter((scan) => scan.status !== 'optional').length;
  const done =
    detail.forms.filter((form) => form.status === 'complete').length +
    detail.scans.filter(isScanSatisfied).length;
  return required > 0 ? Math.round((done / required) * 100) : 0;
}

/** Recompute a summary row's counts and status from its detail. */
export function refreshSubOrderCounts(row: SubOrder, detail: SubOrderDetail): SubOrder {
  const formsTotal = detail.forms.length;
  const formsComplete = detail.forms.filter((form) => form.status === 'complete').length;
  const scansTotal = detail.scans.length;
  const scansComplete = detail.scans.filter(isScanSatisfied).length;
  return {
    ...row,
    formsTotal,
    formsComplete,
    scansTotal,
    scansComplete,
    status: deriveSubOrderStatus(formsTotal, formsComplete, scansTotal, scansComplete),
  };
}

/** Detail for seed rows that ship without one (Angular buildDetailFromSummary). */
export function buildDetailFromSummary(row: SubOrder): SubOrderDetail {
  return {
    id: row.id,
    forms: Array.from({ length: row.formsTotal }, (_, index) => ({
      id: `${row.id}-form-${String(index + 1)}`,
      label:
        row.formsTotal === 1 ? `${row.service} Form` : `${row.service} Form ${String(index + 1)}`,
      required: true,
      status: index < row.formsComplete ? ('complete' as const) : ('incomplete' as const),
    })),
    scans: Array.from({ length: row.scansTotal }, (_, index) => ({
      id: `${row.id}-scan-${String(index + 1)}`,
      label:
        row.scansTotal === 1 ? `${row.service} Scan` : `${row.service} Scan ${String(index + 1)}`,
      format: 'Linked record',
      status: index < row.scansComplete ? ('uploaded' as const) : ('missing' as const),
    })),
    activity: [],
  };
}

export function nextSubOrderSequence(rows: readonly SubOrder[]): number {
  const ids = rows
    .map((row) => Number(row.id.replace('so-', '')))
    .filter((value) => Number.isFinite(value));
  return (ids.length > 0 ? Math.max(...ids) : 0) + 1;
}

export interface CreateSubOrderInput {
  service: string;
  icon: string;
  priority: Priority;
  dueDate: string;
  notes: string;
  teeth: number[];
  scanRequirements: string[];
  creationData: SubOrderCreationData;
}

/**
 * One pending sub-order per selected service: one required clinical form,
 * one scan slot per requirement (Angular createForOrder).
 *
 * Enhancement: files attached in the create wizard mark their requirement
 * as selected locally instead of being dropped, so counts reflect them.
 */
export function buildSubOrdersForOrder<R extends CreateSubOrderInput>(
  orderId: string,
  orderNumber: string,
  rows: readonly R[],
  firstSequence: number,
  now: string,
  filesByRequirement: (row: R, requirement: string) => string[]
): { subOrders: SubOrder[]; details: SubOrderDetail[] } {
  const subOrders: SubOrder[] = [];
  const details: SubOrderDetail[] = [];
  rows.forEach((row, index) => {
    const id = `so-${String(firstSequence + index)}`;
    const scans: SubOrderScanItem[] = row.scanRequirements.map((label, scanIndex) => {
      const names = filesByRequirement(row, label);
      const localFiles: SubOrderScanLocalFile[] = names.map((name, fileIndex) => ({
        id: `${id}-scan-${String(scanIndex + 1)}-file-${String(fileIndex + 1)}`,
        name,
        sizeBytes: 0,
        sizeLabel: '—',
        type: 'application/octet-stream',
        lastModified: 0,
        selectedAt: now,
      }));
      return {
        id: `${id}-scan-${String(scanIndex + 1)}`,
        label,
        format: 'Any file type',
        status: localFiles.length > 0 ? 'selected-local' : 'missing',
        localFiles,
      };
    });
    const detail: SubOrderDetail = {
      id,
      forms: [
        {
          id: `${id}-form-clinical`,
          label: `${row.service} Clinical Form`,
          required: true,
          status: 'incomplete',
        },
      ],
      scans,
      activity: [
        {
          time: 'just now',
          user: 'System',
          text: `${row.service} sub-order created from order ${orderNumber}.`,
        },
      ],
    };
    const summary: SubOrder = {
      id,
      orderId,
      service: row.service,
      icon: row.icon,
      status: 'pending',
      formsComplete: 0,
      formsTotal: 0,
      scansComplete: 0,
      scansTotal: 0,
      teeth: [...row.teeth],
      priority: row.priority,
      dueDate: row.dueDate,
      notes: row.notes,
      creationData: structuredClone(row.creationData),
    };
    subOrders.push(refreshSubOrderCounts(summary, detail));
    details.push(detail);
  });
  return { subOrders, details };
}

/**
 * Save a clinical form. Clinical notes are the minimum requirement:
 * required forms become complete/incomplete, optional forms
 * complete/optional (Angular saveFormItem).
 */
export function applyFormSave(
  detail: SubOrderDetail,
  formId: string,
  values: Partial<SubOrderFormDraftValue>,
  context: SubOrderContextSnapshot,
  now: string
): SubOrderDetail {
  const merged: SubOrderFormDraftValue = { ...DEFAULT_SUB_ORDER_FORM_VALUES, ...values };
  const hasMinimum = merged.clinicalNotes.trim().length > 0;
  return {
    ...detail,
    forms: detail.forms.map((form) => {
      if (form.id !== formId) return form;
      const status: SubOrderFormItemStatus = form.required
        ? hasMinimum
          ? 'complete'
          : 'incomplete'
        : hasMinimum
          ? 'complete'
          : 'optional';
      return { ...form, status, value: { values: merged, context, updatedAt: now } };
    }),
  };
}

export function applyScanFiles(
  detail: SubOrderDetail,
  scanId: string,
  files: SubOrderScanLocalFile[],
  now: string
): SubOrderDetail {
  return {
    ...detail,
    scans: detail.scans.map((scan) =>
      scan.id === scanId
        ? {
            ...scan,
            localFiles: files,
            status: files.length > 0 ? 'selected-local' : 'missing',
            updatedAt: now,
          }
        : scan
    ),
  };
}

/** Angular SubOrderColorService.canonicalServiceKey: "Final Restoration" -> "final-restoration". */
export function canonicalServiceKey(raw: string): string {
  return (
    raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'other'
  );
}

/**
 * Stable palette slot for a service (Angular hashed into a bright 8-color
 * palette; the slot now indexes the muted categorical chart palette).
 */
export function serviceColorIndex(service: string, paletteSize: number): number {
  let hash = 0;
  for (const char of canonicalServiceKey(service)) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash % paletteSize;
}
