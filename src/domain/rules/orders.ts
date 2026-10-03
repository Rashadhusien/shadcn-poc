/**
 * Order rules: lifecycle, creation derivations, CSV export.
 *
 * Source: Angular `order-workflow.component.ts`, `create-order.component.ts
 * #submitOrder`, `order-data.service.ts#createOrder`, `orders.component.ts
 * #exportCsv`.
 */

import { ORDER_STAGE_FLOW, WORKFLOW_STAGES, type WorkflowStageDefinition } from '../catalog';
import type { ArchType, Order, OrderStatus, RestoType } from '../models';
import { toCsv } from './table';

/** Index in the lifecycle; Cancelled (outside the flow) returns -1. */
export function stageIndex(status: OrderStatus): number {
  return ORDER_STAGE_FLOW.indexOf(status);
}

/** The stage an order can advance to, or null when completed/cancelled. */
export function nextStage(status: OrderStatus): WorkflowStageDefinition | null {
  const index = stageIndex(status);
  if (index < 0 || index >= WORKFLOW_STAGES.length - 1) return null;
  return WORKFLOW_STAGES[index + 1] ?? null;
}

export function mapServiceToRestoration(serviceId: string): RestoType {
  if (serviceId === 'surgical-guide') return 'Implant Crown';
  if (serviceId === 'final-restoration' || serviceId === 'fmb') return 'Bridge';
  if (serviceId === 'temp-restoration') return 'Crown';
  if (serviceId === 'gfmr' || serviceId === 'full-guide') return 'Full Arch';
  return 'Crown';
}

/** FDI 11-28 upper, 31-48 lower; no teeth defaults to Both. */
export function deriveArch(teeth: readonly number[]): ArchType {
  const upper = teeth.some((tooth) => tooth >= 11 && tooth <= 28);
  const lower = teeth.some((tooth) => tooth >= 31 && tooth <= 48);
  if (upper && !lower) return 'Maxilla';
  if (lower && !upper) return 'Mandible';
  return 'Both';
}

/** $250 per selected service, minimum $250. */
export function orderAmountForServices(serviceCount: number): number {
  return Math.max(serviceCount * 250, 250);
}

/** Today + 7 days as YYYY-MM-DD. */
export function defaultDueDate(now: Date): string {
  const date = new Date(now);
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

/**
 * Next `DL-0240NN` number.
 *
 * Fix (D2): Angular used 24000 + orders.length + 1, which repeats an
 * existing number after an order is deleted. Use the highest number + 1.
 */
export function nextOrderNumber(orders: readonly Order[]): string {
  const highest = Math.max(
    24000,
    ...orders.map((order) => Number(order.orderNumber.replace('DL-', '')) || 0)
  );
  return `DL-${String(highest + 1).padStart(6, '0')}`;
}

export function nextOrderId(orders: readonly Order[]): string {
  const highest = Math.max(0, ...orders.map((order) => Number(order.id.replace('ord-', '')) || 0));
  return `ord-${String(highest + 1)}`;
}

/** Orders CSV — same 9 columns as Angular (status uses the display label). */
export function ordersToCsv(rows: readonly Order[]): string {
  return toCsv(
    [
      'Order #',
      'Patient',
      'Doctor',
      'Clinic',
      'Status',
      'Priority',
      'Restoration',
      'Amount',
      'Received',
    ],
    rows.map((order) => [
      order.orderNumber,
      order.patientName,
      order.doctorName,
      order.clinicName,
      order.status,
      order.priority,
      order.restoration,
      order.amount,
      order.receivedAt,
    ])
  );
}
