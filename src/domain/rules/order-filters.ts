/**
 * Orders list filtering.
 *
 * Source: Angular `orders.component.ts` (`filtered`, `activeFilters`,
 * `patientOptions`, `doctorOptions`, `subOrderServiceOptions`,
 * `subOrderServicesByOrderId`).
 */

import type { Order, OrderStatus, Priority, SubOrder } from '../models';
import { filterRows, uniqueSorted } from './table';

export interface OrderFilters {
  statuses: OrderStatus[];
  priority: Priority | null;
  patient: string | null;
  doctor: string | null;
  service: string | null;
}

export const EMPTY_ORDER_FILTERS: OrderFilters = {
  statuses: [],
  priority: null,
  patient: null,
  doctor: null,
  service: null,
};

/** Service names per order id, from its sub-orders. */
export function servicesByOrder(subOrders: readonly SubOrder[]): Map<string, Set<string>> {
  const byOrder = new Map<string, Set<string>>();
  for (const row of subOrders) {
    const service = row.service.trim();
    if (!row.orderId || !service) continue;
    const set = byOrder.get(row.orderId) ?? new Set<string>();
    set.add(service);
    byOrder.set(row.orderId, set);
  }
  return byOrder;
}

export function applyOrderFilters(
  orders: readonly Order[],
  search: string,
  filters: OrderFilters,
  services: Map<string, Set<string>>
): Order[] {
  return filterRows(orders, search, [
    (order) => order.orderNumber,
    (order) => order.patientName,
    (order) => order.doctorName,
    (order) => order.clinicName,
  ]).filter(
    (order) =>
      (filters.statuses.length === 0 || filters.statuses.includes(order.status)) &&
      (filters.priority == null || order.priority === filters.priority) &&
      (filters.patient == null || order.patientName === filters.patient) &&
      (filters.doctor == null || order.doctorName === filters.doctor) &&
      (filters.service == null || (services.get(order.id)?.has(filters.service) ?? false))
  );
}

export interface OrderFilterOptions {
  patients: string[];
  doctors: string[];
  services: string[];
}

export function orderFilterOptions(
  orders: readonly Order[],
  subOrders: readonly SubOrder[]
): OrderFilterOptions {
  return {
    patients: uniqueSorted(orders.map((order) => order.patientName)),
    doctors: uniqueSorted(orders.map((order) => order.doctorName)),
    services: uniqueSorted(subOrders.map((row) => row.service)),
  };
}

export type OrderFilterKey = keyof OrderFilters;

export interface ActiveOrderFilter {
  key: OrderFilterKey;
  value: string;
  label: string;
}

/** One chip per active value (Angular `activeFilters`). */
export function activeOrderFilters(filters: OrderFilters): ActiveOrderFilter[] {
  const single = (key: Exclude<OrderFilterKey, 'statuses'>, label: string) => {
    const value = filters[key];
    return value == null ? [] : [{ key, value, label: `${label}: ${value}` }];
  };
  return [
    ...filters.statuses.map((status) => ({
      key: 'statuses' as const,
      value: status,
      label: `Status: ${status}`,
    })),
    ...single('priority', 'Priority'),
    ...single('patient', 'Patient'),
    ...single('doctor', 'Doctor'),
    ...single('service', 'Service'),
  ];
}

export function removeOrderFilter(filters: OrderFilters, chip: ActiveOrderFilter): OrderFilters {
  if (chip.key === 'statuses') {
    return { ...filters, statuses: filters.statuses.filter((status) => status !== chip.value) };
  }
  return { ...filters, [chip.key]: null };
}
