/**
 * Edit order form rules.
 *
 * Source: Angular `edit-order.component.ts` (`editForm` validators:
 * patient, doctor, clinic, restoration, arch, shade, format, status, priority
 * required; units required, 1-32; due date, bill to, notes optional).
 * Relation names are resolved by the store when ids change.
 */

import { isBusinessPriority } from '../priority';
import {
  ARCH_TYPES,
  ORDER_STATUSES,
  RESTORATION_TYPES,
  type ArchType,
  type Order,
  type OrderStatus,
  type RestoType,
} from '../models';

export interface OrderEditValues {
  patientId: string;
  doctorId: string;
  clinicId: string;
  restoration: string;
  arch: string;
  shade: string;
  format: string;
  units: string;
  status: string;
  priority: string;
  dueDate: string;
  billTo: string;
  notes: string;
  isLocked: boolean;
}

export type OrderEditErrors = Partial<Record<keyof OrderEditValues, string>>;

export function orderEditValues(order: Order): OrderEditValues {
  return {
    patientId: order.patientId,
    doctorId: order.doctorId,
    clinicId: order.clinicId,
    restoration: order.restoration,
    arch: order.arch,
    shade: order.shade,
    format: order.format,
    units: String(order.units),
    status: order.status,
    priority: order.priority,
    dueDate: order.dueDate.slice(0, 10),
    billTo: order.billTo,
    notes: order.notes,
    isLocked: order.isLocked,
  };
}

const REQUIRED: readonly [keyof OrderEditValues, string][] = [
  ['patientId', 'Select a patient.'],
  ['doctorId', 'Select a doctor.'],
  ['clinicId', 'Select a clinic.'],
  ['restoration', 'Select a restoration type.'],
  ['arch', 'Select an arch.'],
  ['shade', 'Select a shade.'],
  ['format', 'Select a file format.'],
  ['status', 'Select a status.'],
  ['priority', 'Select a priority.'],
];

export function validateOrderEdit(values: OrderEditValues): OrderEditErrors {
  const errors: OrderEditErrors = {};
  for (const [key, message] of REQUIRED) {
    if (!String(values[key]).trim()) errors[key] = message;
  }
  const units = Number(values.units);
  if (!values.units.trim()) errors.units = 'Enter the number of units.';
  else if (!Number.isInteger(units) || units < 1 || units > 32) {
    errors.units = 'Units must be a whole number from 1 to 32.';
  }
  return errors;
}

/** Changes to save (call only when validation passed). */
export function orderEditChanges(values: OrderEditValues): Partial<Order> {
  return {
    patientId: values.patientId,
    doctorId: values.doctorId,
    clinicId: values.clinicId,
    restoration: (RESTORATION_TYPES as readonly string[]).includes(values.restoration)
      ? (values.restoration as RestoType)
      : undefined,
    arch: (ARCH_TYPES as readonly string[]).includes(values.arch)
      ? (values.arch as ArchType)
      : undefined,
    shade: values.shade,
    format: values.format,
    units: Number(values.units),
    status: (ORDER_STATUSES as readonly string[]).includes(values.status)
      ? (values.status as OrderStatus)
      : undefined,
    priority: isBusinessPriority(values.priority) ? values.priority : undefined,
    dueDate: values.dueDate,
    billTo: values.billTo,
    notes: values.notes,
    hasNotes: values.notes.trim().length > 0,
    isLocked: values.isLocked,
  };
}
