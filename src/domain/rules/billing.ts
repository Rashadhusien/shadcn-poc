/**
 * Billing export (Angular billing.component exportRecords): the filtered
 * rows in the current order, Angular's 8-column header.
 */

import type { BillingRecord } from '../models';
import { toCsv } from './table';

const HEADER = [
  'Order #',
  'Patient',
  'Doctor',
  'Clinic',
  'Invoice #',
  'Amount',
  'Status',
  'Due Date',
] as const;

export function billingToCsv(records: readonly BillingRecord[]): string {
  return toCsv(
    HEADER,
    records.map((row) => [
      row.orderNumber,
      row.patientName,
      row.doctorName,
      row.clinicName,
      row.invoiceNumber ?? '',
      row.amount,
      row.status,
      row.dueDate,
    ])
  );
}
