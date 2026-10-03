/**
 * AppData contexts and hooks. State and actions live in separate contexts
 * so components that only dispatch do not re-render on every state change.
 */

import { createContext, useContext } from 'react';
import type { CollectionKey, CollectionTypes } from './api';
import type { AppDataState, LoadStatus } from './app-data-reducer';
import type {
  AppSettings,
  ChangeRequestStatus,
  Clinic,
  Doctor,
  DocumentCategory,
  Order,
  OrderStatus,
  Patient,
  SubOrderFormDraftValue,
} from '@/domain/models';
import type { IncomingFile } from '@/domain/rules/files';
import type { OrderCreationInput } from '@/domain/rules/order-creation';

export interface AppDataActions {
  reload: (key: CollectionKey) => void;
  /** Returns the new order id, or null when a relation is missing. */
  createOrder: (input: OrderCreationInput) => string | null;
  updateOrder: (id: string, changes: Partial<Order>) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  addOrderNote: (orderId: string, text: string) => void;
  addCaseNote: (caseId: string, text: string) => void;
  /** Validates, adds, and simulates upload progress; returns rejections. */
  uploadOrderFiles: (orderId: string, files: readonly IncomingFile[]) => string[];
  retryOrderFile: (orderId: string, fileId: string) => void;
  removeOrderFile: (orderId: string, fileId: string) => void;
  saveSubOrderForm: (
    subOrderId: string,
    formId: string,
    values: Partial<SubOrderFormDraftValue>
  ) => void;
  /** Adds local scan files; returns the status message. */
  addSubOrderScanFiles: (
    subOrderId: string,
    scanId: string,
    files: readonly IncomingFile[]
  ) => string;
  removeSubOrderScanFile: (subOrderId: string, scanId: string, fileId: string) => void;
  addSubOrderActivity: (subOrderId: string, text: string) => void;
  setChangeRequestStatus: (
    id: string,
    status: Extract<ChangeRequestStatus, 'Approved' | 'Rejected'>
  ) => void;
  /** Up to 10 files; Angular filed every upload under "Scan Files". */
  addDocuments: (files: readonly IncomingFile[], category?: DocumentCategory) => void;
  deleteDocument: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addPatient: (patient: Patient) => void;
  addDoctor: (doctor: Doctor) => void;
  addClinic: (clinic: Clinic) => void;
  updateSettings: (settings: AppSettings) => void;
}

export const AppDataStateContext = createContext<AppDataState | null>(null);
export const AppDataActionsContext = createContext<AppDataActions | null>(null);

export function useAppData(): AppDataState {
  const value = useContext(AppDataStateContext);
  if (!value) throw new Error('useAppData must be used within AppDataProvider');
  return value;
}

export function useAppActions(): AppDataActions {
  const value = useContext(AppDataActionsContext);
  if (!value) throw new Error('useAppActions must be used within AppDataProvider');
  return value;
}

export interface CollectionResult<K extends CollectionKey> {
  data: CollectionTypes[K];
  status: LoadStatus;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/** One collection with its load state (Angular `service.items/loading/error`). */
export function useCollection<K extends CollectionKey>(key: K): CollectionResult<K> {
  const state = useAppData();
  const { reload } = useAppActions();
  const meta = state.meta[key];
  return {
    data: state[key],
    status: meta.status,
    loading: meta.status === 'loading',
    error: meta.error,
    reload: () => {
      reload(key);
    },
  };
}
