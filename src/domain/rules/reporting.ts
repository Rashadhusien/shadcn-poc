/**
 * Reporting rules: the generated reporting dataset and every aggregation the
 * reports pages show.
 *
 * Source: Angular `core/services/reporting-data.service.ts` (deterministic
 * generators over public/data/reporting-seed.json) and the reports,
 * orders-range, quarter-targets, quarter-detail and team-performance
 * components. `now` is a parameter so the rules stay pure; Angular read the
 * clock inside each generator.
 */

import type { Order, ReportingSeedData } from '../models';
import { WORKFLOW_STAGES } from '../catalog';

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const MONTH_SHORT = MONTH_NAMES.map((name) => name.slice(0, 3));

export interface ArchiveOrder {
  id: string;
  orderId: string;
  scanCenter: string;
  doctorName: string;
  patientName: string;
  serviceName: string;
  maxillary: boolean;
  mandibular: boolean;
  amount: number;
  vouchers: number;
  receivedAt: string;
  sentAt: string;
  operator: string;
  archiveDate: string;
  chargedAt: string | null;
}

export interface MonthlyServiceMetric {
  year: number;
  month: number;
  serviceKey: string;
  serviceName: string;
  ordersCount: number;
  totalRevenue: number;
}

export interface ServiceTotals {
  serviceKey: string;
  serviceName: string;
  ordersCount: number;
  totalRevenue: number;
  averageUnitPrice: number;
}

export interface QuarterMonth {
  month: number;
  monthLabel: string;
  ordersCount: number;
  totalRevenue: number;
  services: ServiceTotals[];
}

export interface QuarterReport {
  year: number;
  quarter: number;
  quarterLabel: string;
  ordersCount: number;
  totalRevenue: number;
  services: ServiceTotals[];
  months: QuarterMonth[];
}

export interface TeamMember {
  userId: number;
  type: string;
  fullName: string;
  completedOrders: number;
  revenueCollected: number;
  avgTurnaroundDays: number;
  onTimeRate: number;
  status: 'Active' | 'On Leave';
}

// ---------------------------------------------------------------------------
// Generated dataset
// ---------------------------------------------------------------------------

export function activeYearRange(
  seed: ReportingSeedData,
  now: Date
): { startYear: number; endYear: number } {
  const endYear = Math.min(seed.endYear, now.getUTCFullYear());
  return { startYear: Math.min(seed.startYear, endYear), endYear };
}

/** Newest first, as the year selector lists them. */
export function availableYears(seed: ReportingSeedData, now: Date): number[] {
  if (seed.services.length === 0) return [];
  const { startYear, endYear } = activeYearRange(seed, now);
  const years: number[] = [];
  for (let year = endYear; year >= startYear; year -= 1) years.push(year);
  return years;
}

const pick = (values: readonly string[], index: number, fallback: string) =>
  values.length === 0 ? fallback : (values[index % values.length] ?? fallback);

/** Archived orders (Angular generateOrderArchiveRecords), newest first. */
export function generateOrderArchive(seed: ReportingSeedData, now: Date): ArchiveOrder[] {
  if (seed.services.length === 0) return [];
  const records: ArchiveOrder[] = [];
  let sequence = 1;
  const { startYear, endYear } = activeYearRange(seed, now);
  const currentMonth = now.getUTCMonth() + 1;
  const currentDay = Math.max(1, now.getUTCDate());

  for (let year = startYear; year <= endYear; year += 1) {
    const maxMonth = year === endYear ? currentMonth : 12;
    for (let month = 1; month <= maxMonth; month += 1) {
      const ordersInMonth = 24 + ((year + month) % 15);
      const maxDay = year === endYear && month === currentMonth ? currentDay : 28;
      for (let index = 0; index < ordersInMonth; index += 1) {
        const service = seed.services[(month * 3 + index + year) % seed.services.length];
        if (service === undefined) continue;
        const unitCount = 1 + ((year + month + index) % 4);
        const day = Math.max(1, Math.min(maxDay, 1 + ((index * 2 + year + month) % maxDay)));
        const received = new Date(Date.UTC(year, month - 1, day, 8 + (index % 5), 15, 0));
        const sent = new Date(received);
        sent.setUTCDate(sent.getUTCDate() + 1 + ((index + month) % 4));
        if (sent.getTime() > now.getTime()) sent.setTime(now.getTime());
        const charged = new Date(sent);
        charged.setUTCHours(charged.getUTCHours() + 3);
        if (charged.getTime() > now.getTime()) charged.setTime(now.getTime());
        const mandibular = (month + index + year) % 3 === 0;
        const maxillary = (month + index) % 2 === 0 || !mandibular;
        const pricePerUnit = service.basePrice * 12 + ((month + year + index) % 5) * 7;
        records.push({
          id: `archive-${String(sequence)}`,
          orderId: `DL-${String(year).slice(2)}${String(month).padStart(2, '0')}${String(sequence).padStart(4, '0')}`,
          scanCenter: pick(seed.scanCenters, sequence + index, 'Scan Center'),
          doctorName: pick(seed.doctors, sequence, 'N/A'),
          patientName: `${pick(seed.patientsFirstNames, sequence, 'Patient')} ${pick(
            seed.patientsLastNames,
            sequence + month,
            'Name'
          )}`,
          serviceName: service.label,
          maxillary,
          mandibular,
          amount: pricePerUnit * unitCount,
          vouchers: (sequence + month) % 3,
          receivedAt: received.toISOString(),
          sentAt: sent.toISOString(),
          operator: pick(seed.operators, sequence + year, 'operator'),
          archiveDate: sent.toISOString().slice(0, 10),
          chargedAt: (index + month + year) % 5 !== 0 ? charged.toISOString() : null,
        });
        sequence += 1;
      }
    }
  }
  return records.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
}

/** Orders and revenue per service per month (Angular generateMonthlyServiceMetrics). */
export function generateMonthlyServiceMetrics(
  seed: ReportingSeedData,
  now: Date
): MonthlyServiceMetric[] {
  const metrics: MonthlyServiceMetric[] = [];
  const { startYear, endYear } = activeYearRange(seed, now);
  const yearSpan = endYear - startYear + 1;
  const currentMonth = now.getUTCMonth() + 1;
  for (let year = startYear; year <= endYear; year += 1) {
    const yearOffset = year - startYear;
    const maxMonth = year === endYear ? currentMonth : 12;
    for (let month = 1; month <= maxMonth; month += 1) {
      seed.services.forEach((service, serviceIndex) => {
        const baseline = 42 + ((month * 7 + serviceIndex * 9 + yearOffset * 13) % 75);
        const ordersCount =
          baseline + Math.ceil(month / 3) * 4 + Math.floor((yearOffset / yearSpan) * 9);
        const averagePrice = service.basePrice + ((month + serviceIndex + yearOffset) % 7);
        metrics.push({
          year,
          month,
          serviceKey: service.key,
          serviceName: service.label,
          ordersCount,
          totalRevenue: ordersCount * averagePrice,
        });
      });
    }
  }
  return metrics;
}

/** Team records (Angular generateTeamPerformanceRows). */
export function generateTeamPerformance(seed: ReportingSeedData): TeamMember[] {
  return seed.employeeNames.map((name, index) => {
    const completedOrders = 70 + ((index * 13) % 210);
    return {
      userId: 120 + index,
      type: pick(seed.employeeTypes, index, 'Planner'),
      fullName: name,
      completedOrders,
      revenueCollected: completedOrders * (38 + ((index + 3) % 11) * 4),
      avgTurnaroundDays: Number((1.8 + ((index + 2) % 8) * 0.22).toFixed(1)),
      onTimeRate: 80 + ((index * 3) % 19),
      status: index % 8 === 0 ? 'On Leave' : 'Active',
    };
  });
}

// ---------------------------------------------------------------------------
// Quarters
// ---------------------------------------------------------------------------

function aggregateServices(
  metrics: readonly MonthlyServiceMetric[],
  services: ReportingSeedData['services']
): ServiceTotals[] {
  const totals = new Map<string, { ordersCount: number; totalRevenue: number }>();
  metrics.forEach((metric) => {
    const current = totals.get(metric.serviceKey) ?? { ordersCount: 0, totalRevenue: 0 };
    current.ordersCount += metric.ordersCount;
    current.totalRevenue += metric.totalRevenue;
    totals.set(metric.serviceKey, current);
  });
  return services.map((service) => {
    const total = totals.get(service.key) ?? { ordersCount: 0, totalRevenue: 0 };
    return {
      serviceKey: service.key,
      serviceName: service.label,
      ...total,
      averageUnitPrice:
        total.ordersCount === 0 ? 0 : Math.round(total.totalRevenue / total.ordersCount),
    };
  });
}

const sumOf = <T>(rows: readonly T[], value: (row: T) => number) =>
  rows.reduce((total, row) => total + value(row), 0);

export const quarterMonths = (quarter: number) => {
  const start = (quarter - 1) * 3 + 1;
  return [start, start + 1, start + 2];
};

/** Q1–Q4 for a year; a quarter without data has no months. */
export function quarterReports(
  metrics: readonly MonthlyServiceMetric[],
  services: ReportingSeedData['services'],
  year: number
): QuarterReport[] {
  return [1, 2, 3, 4].map((quarter) => {
    const scoped = metrics.filter(
      (metric) => metric.year === year && quarterMonths(quarter).includes(metric.month)
    );
    const months = quarterMonths(quarter).flatMap((month) => {
      const monthMetrics = scoped.filter((metric) => metric.month === month);
      if (monthMetrics.length === 0) return [];
      const monthServices = aggregateServices(monthMetrics, services);
      return [
        {
          month,
          monthLabel: MONTH_NAMES[month - 1] ?? '',
          ordersCount: sumOf(monthServices, (row) => row.ordersCount),
          totalRevenue: sumOf(monthServices, (row) => row.totalRevenue),
          services: monthServices,
        },
      ];
    });
    const quarterServices = scoped.length === 0 ? [] : aggregateServices(scoped, services);
    return {
      year,
      quarter,
      quarterLabel: `Q${String(quarter)}`,
      ordersCount: sumOf(quarterServices, (row) => row.ordersCount),
      totalRevenue: sumOf(quarterServices, (row) => row.totalRevenue),
      services: quarterServices,
      months,
    };
  });
}

export function isFutureQuarter(year: number, quarter: number, now: Date): boolean {
  const currentYear = now.getUTCFullYear();
  if (year !== currentYear) return year > currentYear;
  return quarter > Math.floor(now.getUTCMonth() / 3) + 1;
}

/**
 * Annual revenue target. Fix (D5): Angular set the target to the year's own
 * revenue × 1.12, so progress always read ~89% whatever happened. The target
 * is now the previous year's revenue × 1.12 (a growth goal); the first year
 * of data has no target.
 */
export function annualTarget(
  metrics: readonly MonthlyServiceMetric[],
  year: number
): number | null {
  const previous = metrics.filter((metric) => metric.year === year - 1);
  if (previous.length === 0) return null;
  return Math.round(sumOf(previous, (row) => row.totalRevenue) * 1.12);
}

export const percentOf = (part: number, whole: number) =>
  whole === 0 ? 0 : Math.round((part / whole) * 100);

/** Active services of a period, highest revenue first. */
export const topServices = (services: readonly ServiceTotals[], limit: number) =>
  services
    .filter((service) => service.ordersCount > 0)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);

// ---------------------------------------------------------------------------
// Reports overview
// ---------------------------------------------------------------------------

/** Total revenue for each of the last `count` months up to `now`. */
export function monthlyRevenue(
  metrics: readonly MonthlyServiceMetric[],
  now: Date,
  count = 12
): { key: string; label: string; revenue: number }[] {
  const points: { key: string; label: string; revenue: number }[] = [];
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    points.push({
      key: `${String(year)}-${String(month).padStart(2, '0')}`,
      label: `${MONTH_SHORT[month - 1]} ${String(year).slice(2)}`,
      revenue: sumOf(
        metrics.filter((metric) => metric.year === year && metric.month === month),
        (row) => row.totalRevenue
      ),
    });
  }
  return points;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/** Average received→sent days by weekday received, from the archive. */
export function turnaroundByWeekday(
  archive: readonly ArchiveOrder[]
): { day: string; days: number; orders: number }[] {
  return WEEKDAYS.map((day, index) => {
    const rows = archive.filter((row) => (new Date(row.receivedAt).getUTCDay() + 6) % 7 === index);
    const total = sumOf(
      rows,
      (row) => (Date.parse(row.sentAt) - Date.parse(row.receivedAt)) / 86_400_000
    );
    return {
      day,
      orders: rows.length,
      days: rows.length === 0 ? 0 : Number((total / rows.length).toFixed(1)),
    };
  });
}

/** Orders per restoration type, largest first (live orders). */
export function restorationMix(orders: readonly Order[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  orders.forEach((order) =>
    counts.set(order.restoration, (counts.get(order.restoration) ?? 0) + 1)
  );
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Orders per workflow stage, in stage order (live orders). */
export function workflowShare(
  orders: readonly Order[]
): { stage: string; count: number; percent: number }[] {
  const active = orders.filter((order) => order.status !== 'Cancelled');
  return WORKFLOW_STAGES.map((stage) => {
    const count = active.filter((order) => order.status === stage.status).length;
    return { stage: stage.label, count, percent: percentOf(count, active.length) };
  });
}

// ---------------------------------------------------------------------------
// Orders by date
// ---------------------------------------------------------------------------

export interface ArchiveMonth {
  monthKey: string;
  monthLabel: string;
  ordersCount: number;
  totalRevenue: number;
  chargedRevenue: number;
  chargedOrders: number;
  chargeRate: number;
  averageOrderValue: number;
  serviceMix: {
    serviceName: string;
    ordersCount: number;
    totalRevenue: number;
    sharePercent: number;
  }[];
  orders: ArchiveOrder[];
}

/**
 * Archive orders in a date range (inclusive, YYYY-MM-DD) matching a search.
 * Fix: Angular compared local-time range bounds with UTC timestamps, so
 * orders near midnight fell into the wrong day; dates compare as UTC days.
 */
export function filterArchive(
  archive: readonly ArchiveOrder[],
  from: string,
  to: string,
  query: string
): ArchiveOrder[] {
  const needle = query.trim().toLowerCase();
  return archive.filter((row) => {
    const day = row.receivedAt.slice(0, 10);
    if (from && day < from) return false;
    if (to && day > to) return false;
    if (!needle) return true;
    return [row.orderId, row.patientName, row.doctorName, row.scanCenter, row.serviceName].some(
      (value) => value.toLowerCase().includes(needle)
    );
  });
}

/** Month groups, newest first (Angular orders-range monthGroups). */
export function groupArchiveByMonth(rows: readonly ArchiveOrder[]): ArchiveMonth[] {
  const groups = new Map<string, ArchiveOrder[]>();
  rows.forEach((row) => {
    const key = row.receivedAt.slice(0, 7);
    groups.set(key, [...(groups.get(key) ?? []), row]);
  });
  return [...groups.entries()]
    .map(([monthKey, orders]) => {
      const totalRevenue = sumOf(orders, (row) => row.amount);
      const charged = orders.filter((row) => row.chargedAt);
      const byService = new Map<string, { ordersCount: number; totalRevenue: number }>();
      orders.forEach((row) => {
        const current = byService.get(row.serviceName) ?? { ordersCount: 0, totalRevenue: 0 };
        current.ordersCount += 1;
        current.totalRevenue += row.amount;
        byService.set(row.serviceName, current);
      });
      const year = Number(monthKey.slice(0, 4));
      const month = Number(monthKey.slice(5, 7));
      return {
        monthKey,
        monthLabel: `${MONTH_NAMES[month - 1]} ${String(year)}`,
        ordersCount: orders.length,
        totalRevenue,
        chargedRevenue: sumOf(charged, (row) => row.amount),
        chargedOrders: charged.length,
        chargeRate: percentOf(charged.length, orders.length),
        averageOrderValue: orders.length === 0 ? 0 : Math.round(totalRevenue / orders.length),
        serviceMix: [...byService.entries()]
          .map(([serviceName, entry]) => ({
            serviceName,
            ...entry,
            sharePercent: percentOf(entry.totalRevenue, totalRevenue),
          }))
          .sort((a, b) => b.totalRevenue - a.totalRevenue),
        orders: [...orders].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)),
      };
    })
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey));
}

export function archiveArchLabel(row: ArchiveOrder): string {
  if (row.maxillary && row.mandibular) return 'Both arches';
  return row.maxillary ? 'Maxilla' : 'Mandible';
}

// ---------------------------------------------------------------------------
// Team performance
// ---------------------------------------------------------------------------

export const ROLE_PRESENTATION: Partial<Record<string, { label: string; description: string }>> = {
  Planner: { label: 'Case Planning', description: 'Treatment intake and digital case preparation' },
  Designer: {
    label: 'Dental CAD Design',
    description: 'Restoration and appliance design delivery',
  },
  Production: {
    label: 'Production Operations',
    description: 'Manufacturing readiness and release workflow',
  },
  'Quality Control': {
    label: 'Quality Assurance',
    description: 'Clinical and technical validation checkpoints',
  },
  Support: {
    label: 'Client Support',
    description: 'Doctor communication and post-delivery support',
  },
};

/** On-time (70%) and turnaround (30%) blend, 0–100 (Angular performanceScore). */
export function performanceScore(member: TeamMember): number {
  const turnaroundScore = Math.max(0, 100 - member.avgTurnaroundDays * 18);
  return Math.round(member.onTimeRate * 0.7 + turnaroundScore * 0.3);
}

export function teamSummary(members: readonly TeamMember[]) {
  return {
    members: members.length,
    active: members.filter((member) => member.status === 'Active').length,
    totalRevenue: sumOf(members, (member) => member.revenueCollected),
    totalCompleted: sumOf(members, (member) => member.completedOrders),
    averageOnTime:
      members.length === 0
        ? 0
        : Math.round(sumOf(members, (member) => member.onTimeRate) / members.length),
  };
}

export function roleSummaries(members: readonly TeamMember[]) {
  const byRole = new Map<string, TeamMember[]>();
  members.forEach((member) =>
    byRole.set(member.type, [...(byRole.get(member.type) ?? []), member])
  );
  return [...byRole.entries()]
    .map(([type, rows]) => ({
      type,
      members: rows.length,
      totalRevenue: sumOf(rows, (row) => row.revenueCollected),
      averageOnTime: Math.round(sumOf(rows, (row) => row.onTimeRate) / rows.length),
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
}
