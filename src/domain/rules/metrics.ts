/**
 * Derived metrics for the dashboard, billing, change requests, and reports.
 *
 * Source: Angular `dashboard.component.ts`, `billing.component.ts`,
 * `change-requests.component.ts`, `reports.component.ts`,
 * `dashboard-data.service.ts`.
 *
 * Only data-derived values live here (decision D5). Angular's fixed copy
 * ("+12% vs last month", "2 require action today") and the fallback
 * workflow counts shown when no orders load are intentionally not ported.
 */

import type { BillingRecord, Case, ChangeRequest, Order, OrderStatus, VolumeWeek } from '../models';

export interface WorkflowBucket {
  name: string;
  statuses: readonly OrderStatus[];
  count: number;
}

/** Dashboard stage buckets; "Ready" includes Completed as in Angular. */
const DASHBOARD_BUCKETS: readonly Omit<WorkflowBucket, 'count'>[] = [
  { name: 'New', statuses: ['New'] },
  { name: 'Review', statuses: ['Review'] },
  { name: 'Design', statuses: ['Design'] },
  { name: 'Production', statuses: ['Production'] },
  { name: 'QC', statuses: ['Quality Check'] },
  { name: 'Ready', statuses: ['Ready', 'Completed'] },
];

export interface DashboardMetrics {
  totalOrders: number;
  activeCases: number;
  casesInProgress: number;
  pendingReview: number;
  completedOrders: number;
  urgentOrders: number;
  revenue: number;
  /** Average days from received to sent; null when nothing was sent. */
  averageTurnaroundDays: number | null;
  openChangeRequests: number;
  workflow: WorkflowBucket[];
  recentOrders: Order[];
}

export function dashboardMetrics(
  orders: readonly Order[],
  cases: readonly Case[],
  changeRequests: readonly ChangeRequest[]
): DashboardMetrics {
  const sent = orders.filter((order) => order.sentAt);
  const turnaround =
    sent.length === 0
      ? null
      : sent.reduce(
          (sum, order) =>
            sum + (Date.parse(order.sentAt ?? '') - Date.parse(order.receivedAt)) / 86_400_000,
          0
        ) / sent.length;
  return {
    totalOrders: orders.length,
    activeCases: cases.filter((item) => item.status !== 'Closed').length,
    casesInProgress: cases.filter((item) => item.status === 'In Progress').length,
    pendingReview: orders.filter((order) => order.status === 'Review').length,
    // Angular labelled this "Completed Today" but counted every Completed
    // order; the label is corrected in the dashboard phase.
    completedOrders: orders.filter((order) => order.status === 'Completed').length,
    urgentOrders: orders.filter((order) => order.priority === 'Urgent').length,
    revenue: orders.reduce((sum, order) => sum + order.amount, 0),
    averageTurnaroundDays: turnaround,
    openChangeRequests: changeRequests.filter(
      (request) => request.status === 'Pending' || request.status === 'In Review'
    ).length,
    workflow: DASHBOARD_BUCKETS.map((bucket) => ({
      ...bucket,
      count: orders.filter((order) => bucket.statuses.includes(order.status)).length,
    })),
    recentOrders: [...orders]
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .slice(0, 7),
  };
}

export interface BillingMetrics {
  totalValue: number;
  collectedValue: number;
  pendingValue: number;
  overdueCount: number;
}

export function billingMetrics(records: readonly BillingRecord[]): BillingMetrics {
  const sum = (rows: readonly BillingRecord[]) =>
    rows.reduce((total, row) => total + row.amount, 0);
  return {
    totalValue: sum(records),
    collectedValue: sum(records.filter((row) => row.status === 'Paid')),
    pendingValue: sum(records.filter((row) => row.status === 'Pending')),
    overdueCount: records.filter((row) => row.status === 'Overdue').length,
  };
}

export function changeRequestCounts(requests: readonly ChangeRequest[]) {
  return {
    pending: requests.filter((request) => request.status === 'Pending').length,
    inReview: requests.filter((request) => request.status === 'In Review').length,
  };
}

/** Only Pending and In Review requests can be approved or rejected. */
export function isChangeRequestActionable(status: ChangeRequest['status']): boolean {
  return status === 'Pending' || status === 'In Review';
}

export interface ReportsMetrics {
  totalRevenue: number;
  completedOrders: number;
  openCases: number;
  averageOrderValue: number;
}

export function reportsMetrics(
  orders: readonly Order[],
  cases: readonly Case[],
  billing: readonly BillingRecord[]
): ReportsMetrics {
  return {
    totalRevenue: billing
      .filter((row) => row.status === 'Paid')
      .reduce((sum, row) => sum + row.amount, 0),
    completedOrders: orders.filter((order) => order.status === 'Completed').length,
    openCases: cases.filter((item) => item.status !== 'Closed').length,
    averageOrderValue:
      billing.length === 0
        ? 0
        : Math.round(billing.reduce((sum, row) => sum + row.amount, 0) / billing.length),
  };
}

/** Latest week of the volume series (Angular currentWeek). */
export function currentVolumeWeek(weeks: readonly VolumeWeek[]): VolumeWeek | null {
  return weeks.at(-1) ?? null;
}
