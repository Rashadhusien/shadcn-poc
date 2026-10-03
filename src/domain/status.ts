/**
 * Status presentation: the ONLY place that maps a business status to a
 * human label and a semantic tone.
 *
 * UI components (StatusBadge) map tone -> theme tokens. Status is never
 * color-only: StatusBadge always renders icon + label.
 *
 * Source: Angular `shared/utils/status-styles.ts`, `status-label.ts`, and
 * the per-page status class helpers, unified into one table.
 */

/**
 * Six tones shared by every entity:
 * - neutral: not started / inactive / closed
 * - info: queued or informational stage
 * - primary: work actively in progress
 * - warning: waiting on a person (review, missing input)
 * - success: done / healthy
 * - error: cancelled, rejected, overdue, failed, blocked
 */
export type StatusSemantic = 'neutral' | 'info' | 'primary' | 'warning' | 'success' | 'error';

export interface StatusMeta {
  label: string;
  semantic: StatusSemantic;
}

// One label and one tone per status, identical on every screen. Angular
// showed "Completed" as Shipped/Done/Delivered depending on the page; the
// approved label is "Completed" everywhere (decision D3).
const STATUS_META = {
  // Orders (workflow order: New -> ... -> Completed)
  New: { label: 'New', semantic: 'neutral' },
  Review: { label: 'Review', semantic: 'warning' },
  Design: { label: 'Design', semantic: 'info' },
  Production: { label: 'Production', semantic: 'primary' },
  'Quality Check': { label: 'Quality Check', semantic: 'info' },
  Ready: { label: 'Ready', semantic: 'success' },
  Completed: { label: 'Completed', semantic: 'success' },
  Cancelled: { label: 'Cancelled', semantic: 'error' },
  // Cases
  Open: { label: 'Open', semantic: 'info' },
  'In Progress': { label: 'In Progress', semantic: 'primary' },
  Closed: { label: 'Closed', semantic: 'neutral' },
  // Billing
  Invoiced: { label: 'Invoiced', semantic: 'info' },
  Paid: { label: 'Paid', semantic: 'success' },
  Overdue: { label: 'Overdue', semantic: 'error' },
  // Billing and change requests
  Pending: { label: 'Pending', semantic: 'neutral' },
  'In Review': { label: 'In Review', semantic: 'warning' },
  Approved: { label: 'Approved', semantic: 'success' },
  Rejected: { label: 'Rejected', semantic: 'error' },
  // Directory and scan centers
  Active: { label: 'Active', semantic: 'success' },
  Inactive: { label: 'Inactive', semantic: 'neutral' },
  Operational: { label: 'Operational', semantic: 'success' },
  Maintenance: { label: 'Maintenance', semantic: 'warning' },
  // Sub-orders
  done: { label: 'Done', semantic: 'success' },
  'in-progress': { label: 'In Progress', semantic: 'primary' },
  blocked: { label: 'Blocked', semantic: 'error' },
  pending: { label: 'Pending', semantic: 'neutral' },
  // Files and uploads
  uploaded: { label: 'Uploaded', semantic: 'success' },
  uploading: { label: 'Uploading', semantic: 'primary' },
  failed: { label: 'Failed', semantic: 'error' },
  missing: { label: 'Missing', semantic: 'warning' },
  'selected-local': { label: 'Selected locally', semantic: 'info' },
  // Sub-order forms and workflow steps
  complete: { label: 'Complete', semantic: 'success' },
  incomplete: { label: 'Incomplete', semantic: 'warning' },
  optional: { label: 'Optional', semantic: 'neutral' },
  current: { label: 'Current', semantic: 'primary' },
} as const satisfies Record<string, StatusMeta>;

export type StatusValue = keyof typeof STATUS_META;

export function getStatusPresentation(status: StatusValue): StatusMeta {
  return STATUS_META[status];
}
