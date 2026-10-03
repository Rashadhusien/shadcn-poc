/**
 * Mock API: the ONLY module that knows about the seed files.
 *
 * Mirrors the Angular data services, which fetch `/data/*.json` over
 * HttpClient: each load is asynchronous with a short latency, so pages
 * render real loading, error, and retry states. Swapping in a backend later
 * only touches this file.
 *
 * Preview switch (dev/evidence only, replaces Angular's orders-page
 * "normal/loading/empty/error" toggle): `?sim=loading|error|empty` applies to
 * every collection; `&simTarget=orders` limits it to one collection.
 */

import billingSeed from './seed/billing.json';
import casesSeed from './seed/cases.json';
import changeRequestsSeed from './seed/change-requests.json';
import clinicsSeed from './seed/clinics.json';
import volumeSeed from './seed/dashboard-volume.json';
import doctorsSeed from './seed/doctors.json';
import documentsSeed from './seed/documents.json';
import notificationsSeed from './seed/notifications.json';
import ordersSeed from './seed/orders.json';
import patientsSeed from './seed/patients.json';
import reportingSeed from './seed/reporting.json';
import scanCentersSeed from './seed/scan-centers.json';
import subOrdersSeed from './seed/sub-orders.json';
import { SUB_ORDER_ICON_MAP } from '@/domain/catalog';
import { EMPTY_REPORTING_SEED } from '@/domain/models';
import type {
  AppNotification,
  BillingRecord,
  Case,
  ChangeRequest,
  Clinic,
  Doctor,
  LabDocument,
  Order,
  Patient,
  ReportingSeedData,
  ScanCenter,
  SubOrder,
  VolumeWeek,
} from '@/domain/models';

export interface CollectionTypes {
  orders: Order[];
  subOrders: SubOrder[];
  patients: Patient[];
  doctors: Doctor[];
  clinics: Clinic[];
  cases: Case[];
  billing: BillingRecord[];
  changeRequests: ChangeRequest[];
  documents: LabDocument[];
  notifications: AppNotification[];
  scanCenters: ScanCenter[];
  reporting: ReportingSeedData;
  volume: VolumeWeek[];
}

export type CollectionKey = keyof CollectionTypes;

export const COLLECTION_KEYS: readonly CollectionKey[] = [
  'orders',
  'subOrders',
  'patients',
  'doctors',
  'clinics',
  'cases',
  'billing',
  'changeRequests',
  'documents',
  'notifications',
  'scanCenters',
  'reporting',
  'volume',
];

/** Human names for error messages ("Failed to load change requests"). */
export const COLLECTION_LABELS: Record<CollectionKey, string> = {
  orders: 'orders',
  subOrders: 'sub-orders',
  patients: 'patients',
  doctors: 'doctors',
  clinics: 'clinics',
  cases: 'cases',
  billing: 'billing records',
  changeRequests: 'change requests',
  documents: 'documents',
  notifications: 'notifications',
  scanCenters: 'scan centers',
  reporting: 'reporting data',
  volume: 'order volume',
};

// JSON imports widen string unions; the seeds are copied verbatim from the
// Angular source, whose shapes these types describe.
const seeds: { [K in CollectionKey]: () => CollectionTypes[K] } = {
  orders: () => ordersSeed as unknown as Order[],
  subOrders: () =>
    (subOrdersSeed as unknown as SubOrder[]).map((row) => ({
      ...row,
      icon: SUB_ORDER_ICON_MAP[row.icon] ?? row.icon,
    })),
  patients: () => patientsSeed as unknown as Patient[],
  doctors: () => doctorsSeed as unknown as Doctor[],
  clinics: () => clinicsSeed as unknown as Clinic[],
  cases: () => casesSeed as unknown as Case[],
  billing: () => billingSeed as unknown as BillingRecord[],
  changeRequests: () => changeRequestsSeed as unknown as ChangeRequest[],
  documents: () => documentsSeed as unknown as LabDocument[],
  notifications: () => notificationsSeed as unknown as AppNotification[],
  scanCenters: () => scanCentersSeed as unknown as ScanCenter[],
  reporting: () => reportingSeed,
  volume: () => volumeSeed.weeks,
};

const EMPTY: { [K in CollectionKey]: () => CollectionTypes[K] } = {
  orders: () => [],
  subOrders: () => [],
  patients: () => [],
  doctors: () => [],
  clinics: () => [],
  cases: () => [],
  billing: () => [],
  changeRequests: () => [],
  documents: () => [],
  notifications: () => [],
  scanCenters: () => [],
  reporting: () => EMPTY_REPORTING_SEED,
  volume: () => [],
};

type SimState = 'normal' | 'loading' | 'error' | 'empty';

function simulationFor(key: CollectionKey): SimState {
  if (typeof window === 'undefined') return 'normal';
  const params = new URLSearchParams(window.location.search);
  const sim = params.get('sim');
  const target = params.get('simTarget');
  if (target != null && target !== key) return 'normal';
  return sim === 'loading' || sim === 'error' || sim === 'empty' ? sim : 'normal';
}

function latency(): Promise<void> {
  const ms = 200 + Math.floor(Math.random() * 300);
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchCollection<K extends CollectionKey>(
  key: K
): Promise<CollectionTypes[K]> {
  const sim = simulationFor(key);
  if (sim === 'loading') return new Promise<never>(() => undefined);
  await latency();
  if (sim === 'error') throw new Error(`Failed to load ${COLLECTION_LABELS[key]}`);
  if (sim === 'empty') return EMPTY[key]();
  // Fresh copies so in-memory edits never mutate the imported modules.
  return structuredClone(seeds[key]());
}
