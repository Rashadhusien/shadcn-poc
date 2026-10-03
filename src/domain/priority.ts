/**
 * Priority presentation: the ONLY place that maps a business priority to a
 * label and a tone. Tones reuse the status tone scale so a "High" priority
 * and a "Review" status read with the same visual weight.
 *
 * Source: Angular `shared/utils/priority-styles.ts` (Low slate, Normal blue,
 * High amber, Urgent red).
 */

import type { StatusSemantic } from './status';

export const BUSINESS_PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'] as const;

export type BusinessPriority = (typeof BUSINESS_PRIORITIES)[number];

export interface PriorityMeta {
  label: string;
  semantic: StatusSemantic;
  /** Sort weight: higher is more urgent. */
  rank: number;
}

export const PRIORITY_META: Record<BusinessPriority, PriorityMeta> = {
  Low: { label: 'Low', semantic: 'neutral', rank: 0 },
  Normal: { label: 'Normal', semantic: 'info', rank: 1 },
  High: { label: 'High', semantic: 'warning', rank: 2 },
  Urgent: { label: 'Urgent', semantic: 'error', rank: 3 },
};

export function isBusinessPriority(value: string): value is BusinessPriority {
  return (BUSINESS_PRIORITIES as readonly string[]).includes(value);
}

export function getPriorityMeta(priority: string): PriorityMeta {
  return isBusinessPriority(priority) ? PRIORITY_META[priority] : PRIORITY_META.Normal;
}
