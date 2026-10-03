/**
 * AppData reducer: one in-memory store for every business collection.
 *
 * Mirrors the Angular signal services: each collection has data plus a
 * load status and error; mutations are session-only (Angular resets on
 * reload too). All business decisions come from `domain/rules`; this file
 * only applies them to state.
 */

import { COLLECTION_KEYS, type CollectionKey, type CollectionTypes } from './api';
import { DEFAULT_SETTINGS, SUB_ORDER_DETAIL_FIXTURES, initialOrderFiles } from './fixtures';
import {
  applyFormSave,
  buildDetailFromSummary,
  refreshSubOrderCounts,
} from '@/domain/rules/sub-orders';
import { EMPTY_REPORTING_SEED } from '@/domain/models';
import type {
  AppSettings,
  ChangeRequestStatus,
  Clinic,
  Doctor,
  LabDocument,
  Order,
  OrderFile,
  OrderNote,
  Patient,
  SubOrder,
  SubOrderActivityItem,
  SubOrderContextSnapshot,
  SubOrderDetail,
  SubOrderFormDraftValue,
} from '@/domain/models';

export type LoadStatus = 'loading' | 'ready' | 'error';

export interface CollectionMeta {
  status: LoadStatus;
  error: string | null;
}

export type AppDataState = CollectionTypes & {
  meta: Record<CollectionKey, CollectionMeta>;
  subOrderDetails: Record<string, SubOrderDetail>;
  /** Files per order; seeded orders fall back to the Angular file list. */
  orderFiles: Record<string, OrderFile[]>;
  orderNotes: Record<string, OrderNote[]>;
  /** Notes added on case details (Angular had no save). */
  caseNotes: Record<string, OrderNote[]>;
  settings: AppSettings;
};

export type AppDataAction =
  | { type: 'load/start'; key: CollectionKey }
  | { type: 'load/success'; key: CollectionKey; data: CollectionTypes[CollectionKey] }
  | { type: 'load/failure'; key: CollectionKey; error: string }
  | { type: 'order/created'; order: Order; subOrders: SubOrder[]; details: SubOrderDetail[] }
  | { type: 'order/updated'; id: string; changes: Partial<Order> }
  | { type: 'order/deleted'; id: string }
  | { type: 'order/noteAdded'; orderId: string; note: OrderNote }
  | { type: 'case/noteAdded'; caseId: string; note: OrderNote }
  | { type: 'orderFiles/added'; orderId: string; files: OrderFile[] }
  | { type: 'orderFiles/updated'; orderId: string; fileId: string; changes: Partial<OrderFile> }
  | { type: 'orderFiles/removed'; orderId: string; fileId: string }
  | { type: 'subOrder/detailChanged'; id: string; detail: SubOrderDetail }
  | {
      type: 'subOrder/formSaved';
      id: string;
      formId: string;
      values: Partial<SubOrderFormDraftValue>;
      now: string;
    }
  | { type: 'subOrder/activityAdded'; id: string; item: SubOrderActivityItem }
  | { type: 'changeRequest/statusSet'; id: string; status: ChangeRequestStatus }
  | { type: 'document/added'; documents: LabDocument[] }
  | { type: 'document/deleted'; id: string }
  | { type: 'notification/read'; id: string }
  | { type: 'notification/allRead' }
  | { type: 'patient/added'; patient: Patient }
  | { type: 'doctor/added'; doctor: Doctor }
  | { type: 'clinic/added'; clinic: Clinic }
  | { type: 'settings/updated'; settings: AppSettings };

export function createInitialState(): AppDataState {
  const meta = Object.fromEntries(
    COLLECTION_KEYS.map((key) => [key, { status: 'loading', error: null } satisfies CollectionMeta])
  ) as Record<CollectionKey, CollectionMeta>;
  return {
    orders: [],
    subOrders: [],
    patients: [],
    doctors: [],
    clinics: [],
    cases: [],
    billing: [],
    changeRequests: [],
    documents: [],
    notifications: [],
    scanCenters: [],
    reporting: EMPTY_REPORTING_SEED,
    volume: [],
    meta,
    subOrderDetails: {},
    orderFiles: {},
    orderNotes: {},
    caseNotes: {},
    settings: DEFAULT_SETTINGS,
  };
}

/** Sub-order details: Angular fixtures for so-1..so-4, generated otherwise. */
function detailsForSeed(rows: readonly SubOrder[]): Record<string, SubOrderDetail> {
  return Object.fromEntries(
    rows.map((row) => [
      row.id,
      structuredClone(SUB_ORDER_DETAIL_FIXTURES[row.id] ?? buildDetailFromSummary(row)),
    ])
  );
}

function withMeta(state: AppDataState, key: CollectionKey, meta: CollectionMeta): AppDataState {
  return { ...state, meta: { ...state.meta, [key]: meta } };
}

function withOrderFiles(
  state: AppDataState,
  orderId: string,
  update: (files: OrderFile[]) => OrderFile[]
): AppDataState {
  return {
    ...state,
    orderFiles: { ...state.orderFiles, [orderId]: update(state.orderFiles[orderId] ?? []) },
  };
}

function withSubOrderDetail(state: AppDataState, id: string, detail: SubOrderDetail): AppDataState {
  return {
    ...state,
    subOrderDetails: { ...state.subOrderDetails, [id]: detail },
    subOrders: state.subOrders.map((row) =>
      row.id === id ? refreshSubOrderCounts(row, detail) : row
    ),
  };
}

/**
 * Fix (D2): Angular's edit form saved new patient/doctor/clinic ids but kept
 * the old display names. Names are resolved from the directory here.
 */
function relationNames(state: AppDataState, changes: Partial<Order>): Partial<Order> {
  const names: Partial<Order> = {};
  if (changes.patientId != null) {
    const patient = state.patients.find((row) => row.id === changes.patientId);
    if (patient) names.patientName = patient.name;
  }
  if (changes.doctorId != null) {
    const doctor = state.doctors.find((row) => row.id === changes.doctorId);
    if (doctor) names.doctorName = doctor.name;
  }
  if (changes.clinicId != null) {
    const clinic = state.clinics.find((row) => row.id === changes.clinicId);
    if (clinic) names.clinicName = clinic.name;
  }
  return names;
}

export function appDataReducer(state: AppDataState, action: AppDataAction): AppDataState {
  switch (action.type) {
    case 'load/start':
      return withMeta(state, action.key, { status: 'loading', error: null });
    case 'load/failure':
      return withMeta(state, action.key, { status: 'error', error: action.error });
    case 'load/success': {
      const next = withMeta({ ...state, [action.key]: action.data }, action.key, {
        status: 'ready',
        error: null,
      });
      if (action.key === 'subOrders') {
        const rows = action.data as SubOrder[];
        next.subOrderDetails = detailsForSeed(rows);
        // Fix (D2): Angular's hand-written details for so-1..so-4 disagree
        // with the JSON summary counts (so-2: 2 scans uploaded vs "1/3"),
        // and the list only caught up after an edit. Recount those rows from
        // their details at load.
        next.subOrders = rows.map((row) => {
          const detail = next.subOrderDetails[row.id];
          return row.id in SUB_ORDER_DETAIL_FIXTURES && detail !== undefined
            ? refreshSubOrderCounts(row, detail)
            : row;
        });
      }
      if (action.key === 'orders') {
        next.orderFiles = Object.fromEntries(
          (action.data as Order[]).map((order) => [order.id, initialOrderFiles(order.id)])
        );
      }
      return next;
    }
    case 'order/created': {
      const details = Object.fromEntries(action.details.map((detail) => [detail.id, detail]));
      return {
        ...state,
        orders: [action.order, ...state.orders],
        subOrders: [...action.subOrders, ...state.subOrders],
        subOrderDetails: { ...state.subOrderDetails, ...details },
        orderFiles: { ...state.orderFiles, [action.order.id]: [] },
      };
    }
    case 'order/updated':
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.id
            ? {
                ...order,
                ...action.changes,
                ...relationNames(state, action.changes),
                updatedAt: new Date().toISOString(),
              }
            : order
        ),
      };
    case 'order/deleted': {
      // Angular left sub-orders orphaned; they are only reachable through
      // their order, so they are removed with it.
      const removed = new Set(
        state.subOrders.filter((row) => row.orderId === action.id).map((row) => row.id)
      );
      const subOrderDetails = Object.fromEntries(
        Object.entries(state.subOrderDetails).filter(([id]) => !removed.has(id))
      );
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.id),
        subOrders: state.subOrders.filter((row) => !removed.has(row.id)),
        subOrderDetails,
      };
    }
    case 'order/noteAdded':
      return {
        ...state,
        orderNotes: {
          ...state.orderNotes,
          [action.orderId]: [...(state.orderNotes[action.orderId] ?? []), action.note],
        },
      };
    case 'case/noteAdded':
      return {
        ...state,
        caseNotes: {
          ...state.caseNotes,
          [action.caseId]: [...(state.caseNotes[action.caseId] ?? []), action.note],
        },
      };
    case 'orderFiles/added':
      return withOrderFiles(state, action.orderId, (files) => [...action.files, ...files]);
    case 'orderFiles/updated':
      return withOrderFiles(state, action.orderId, (files) =>
        files.map((file) => (file.id === action.fileId ? { ...file, ...action.changes } : file))
      );
    case 'orderFiles/removed':
      return withOrderFiles(state, action.orderId, (files) =>
        files.filter((file) => file.id !== action.fileId)
      );
    case 'subOrder/detailChanged':
      return withSubOrderDetail(state, action.id, action.detail);
    case 'subOrder/formSaved': {
      const detail = state.subOrderDetails[action.id] as SubOrderDetail | undefined;
      const subOrder = state.subOrders.find((row) => row.id === action.id);
      if (!detail || !subOrder) return state;
      const order = state.orders.find((row) => row.id === subOrder.orderId);
      const context: SubOrderContextSnapshot = {
        orderId: order?.id ?? '',
        orderNumber: order?.orderNumber ?? '',
        subOrderId: subOrder.id,
        service: subOrder.service,
        patientName: order?.patientName ?? '',
        doctorName: order?.doctorName ?? '',
        clinicName: order?.clinicName ?? '',
        selectedTeeth: [...subOrder.teeth],
        caseNotes: subOrder.notes || order?.notes || '',
      };
      return withSubOrderDetail(
        state,
        action.id,
        applyFormSave(detail, action.formId, action.values, context, action.now)
      );
    }
    case 'subOrder/activityAdded': {
      const detail = state.subOrderDetails[action.id] as SubOrderDetail | undefined;
      if (!detail) return state;
      return {
        ...state,
        subOrderDetails: {
          ...state.subOrderDetails,
          [action.id]: { ...detail, activity: [action.item, ...detail.activity] },
        },
      };
    }
    case 'changeRequest/statusSet':
      return {
        ...state,
        changeRequests: state.changeRequests.map((request) =>
          request.id === action.id
            ? { ...request, status: action.status, updatedAt: new Date().toISOString() }
            : request
        ),
      };
    case 'document/added':
      return { ...state, documents: [...action.documents, ...state.documents] };
    case 'document/deleted':
      return { ...state, documents: state.documents.filter((doc) => doc.id !== action.id) };
    case 'notification/read':
      return {
        ...state,
        notifications: state.notifications.map((row) =>
          row.id === action.id ? { ...row, read: true } : row
        ),
      };
    case 'notification/allRead':
      return {
        ...state,
        notifications: state.notifications.map((row) => ({ ...row, read: true })),
      };
    case 'patient/added':
      return { ...state, patients: [action.patient, ...state.patients] };
    case 'doctor/added':
      return { ...state, doctors: [action.doctor, ...state.doctors] };
    case 'clinic/added':
      return { ...state, clinics: [action.clinic, ...state.clinics] };
    case 'settings/updated':
      return { ...state, settings: action.settings };
  }
}
