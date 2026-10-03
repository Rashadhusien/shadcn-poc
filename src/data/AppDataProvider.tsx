/**
 * AppDataProvider: loads every collection on mount (Angular services load
 * in their constructors) and exposes typed actions.
 *
 * Actions that need current state (id sequences, validation against
 * existing files) read it from a ref synced after each render; everything
 * else is computed in the reducer from `domain/rules`.
 */

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { ReactNode } from 'react';
import { COLLECTION_KEYS, fetchCollection, type CollectionKey } from './api';
import {
  AppDataActionsContext,
  AppDataStateContext,
  type AppDataActions,
} from './app-data-context';
import { appDataReducer, createInitialState, type AppDataState } from './app-data-reducer';
import { CURRENT_USER } from '@/domain/catalog';
import type { LabDocument, OrderFile } from '@/domain/models';
import {
  fileExtension,
  formatBytes,
  mergeScanFiles,
  validateOrderFiles,
} from '@/domain/rules/files';
import { planOrderCreation } from '@/domain/rules/order-creation';
import { applyScanFiles } from '@/domain/rules/sub-orders';
import { isChangeRequestActionable } from '@/domain/rules/metrics';

/** Angular simulated upload: +22% every 320 ms until complete. */
const UPLOAD_STEP = 22;
const UPLOAD_TICK_MS = 320;

let idCounter = 0;
function uniqueId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${String(idCounter)}`;
}

export default function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appDataReducer, undefined, createInitialState);
  const stateRef = useRef<AppDataState>(state);
  const timers = useRef(new Set<number>());

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const reload = useCallback((key: CollectionKey) => {
    dispatch({ type: 'load/start', key });
    fetchCollection(key).then(
      (data) => {
        dispatch({ type: 'load/success', key, data });
      },
      (error: unknown) => {
        dispatch({
          type: 'load/failure',
          key,
          error: error instanceof Error ? error.message : 'Failed to load data',
        });
      }
    );
  }, []);

  useEffect(() => {
    COLLECTION_KEYS.forEach(reload);
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => {
        window.clearInterval(timer);
      });
      pending.clear();
    };
  }, [reload]);

  const simulateUpload = useCallback((orderId: string, fileId: string, start: number) => {
    let progress = start;
    const timer = window.setInterval(() => {
      progress = Math.min(100, progress + UPLOAD_STEP);
      const done = progress >= 100;
      dispatch({
        type: 'orderFiles/updated',
        orderId,
        fileId,
        changes: { progress, status: done ? 'uploaded' : 'uploading' },
      });
      if (done) {
        window.clearInterval(timer);
        timers.current.delete(timer);
      }
    }, UPLOAD_TICK_MS);
    timers.current.add(timer);
  }, []);

  const actions = useMemo<AppDataActions>(
    () => ({
      reload,
      createOrder: (input) => {
        const current = stateRef.current;
        const plan = planOrderCreation(input, { ...current, now: new Date() });
        if (!plan) return null;
        dispatch({ type: 'order/created', ...plan });
        return plan.order.id;
      },
      updateOrder: (id, changes) => {
        dispatch({ type: 'order/updated', id, changes });
      },
      setOrderStatus: (id, status) => {
        dispatch({ type: 'order/updated', id, changes: { status } });
      },
      deleteOrder: (id) => {
        dispatch({ type: 'order/deleted', id });
      },
      addOrderNote: (orderId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        dispatch({
          type: 'order/noteAdded',
          orderId,
          note: { text: trimmed, at: new Date().toISOString() },
        });
      },
      addCaseNote: (caseId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        dispatch({
          type: 'case/noteAdded',
          caseId,
          note: { text: trimmed, at: new Date().toISOString() },
        });
      },
      uploadOrderFiles: (orderId, files) => {
        const existing = stateRef.current.orderFiles[orderId] ?? [];
        const { accepted, rejected } = validateOrderFiles(
          files,
          existing.map((file) => file.name)
        );
        const today = new Date().toISOString().slice(0, 10);
        const added: OrderFile[] = accepted.map((file) => ({
          id: uniqueId('upload'),
          name: file.name,
          type: fileExtension(file.name),
          size: formatBytes(file.size),
          sizeBytes: file.size,
          status: 'uploading',
          progress: 12,
          uploadedAt: today,
          uploadedBy: 'You',
        }));
        if (added.length > 0) {
          dispatch({ type: 'orderFiles/added', orderId, files: added });
          added.forEach((file) => {
            simulateUpload(orderId, file.id, file.progress);
          });
        }
        return rejected;
      },
      retryOrderFile: (orderId, fileId) => {
        dispatch({
          type: 'orderFiles/updated',
          orderId,
          fileId,
          changes: { status: 'uploading', progress: 8 },
        });
        simulateUpload(orderId, fileId, 8);
      },
      removeOrderFile: (orderId, fileId) => {
        dispatch({ type: 'orderFiles/removed', orderId, fileId });
      },
      saveSubOrderForm: (subOrderId, formId, values) => {
        dispatch({
          type: 'subOrder/formSaved',
          id: subOrderId,
          formId,
          values,
          now: new Date().toISOString(),
        });
      },
      addSubOrderScanFiles: (subOrderId, scanId, files) => {
        const detail = stateRef.current.subOrderDetails[subOrderId] as
          AppDataState['subOrderDetails'][string] | undefined;
        const scan = detail?.scans.find((item) => item.id === scanId);
        if (!detail || !scan) return 'Selected scan requirement was not found.';
        const now = new Date().toISOString();
        const result = mergeScanFiles(scan.localFiles ?? [], files, scan.label, now, () =>
          uniqueId('local')
        );
        dispatch({
          type: 'subOrder/detailChanged',
          id: subOrderId,
          detail: applyScanFiles(detail, scanId, result.files, now),
        });
        return result.message;
      },
      removeSubOrderScanFile: (subOrderId, scanId, fileId) => {
        const detail = stateRef.current.subOrderDetails[subOrderId] as
          AppDataState['subOrderDetails'][string] | undefined;
        const scan = detail?.scans.find((item) => item.id === scanId);
        if (!detail || !scan) return;
        const remaining = (scan.localFiles ?? []).filter((file) => file.id !== fileId);
        dispatch({
          type: 'subOrder/detailChanged',
          id: subOrderId,
          detail: applyScanFiles(detail, scanId, remaining, new Date().toISOString()),
        });
      },
      addSubOrderActivity: (subOrderId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        dispatch({
          type: 'subOrder/activityAdded',
          id: subOrderId,
          item: { time: 'just now', user: CURRENT_USER.name, text: trimmed },
        });
      },
      setChangeRequestStatus: (id, status) => {
        const request = stateRef.current.changeRequests.find((row) => row.id === id);
        if (!request || !isChangeRequestActionable(request.status)) return;
        dispatch({ type: 'changeRequest/statusSet', id, status });
      },
      addDocuments: (files, category = 'Scan Files') => {
        const today = new Date().toISOString().slice(0, 10);
        const documents: LabDocument[] = files.slice(0, 10).map((file) => ({
          id: uniqueId('upload'),
          name: file.name,
          category,
          type: fileExtension(file.name),
          size: formatBytes(file.size),
          date: today,
          doctor: 'You',
        }));
        if (documents.length > 0) dispatch({ type: 'document/added', documents });
      },
      deleteDocument: (id) => {
        dispatch({ type: 'document/deleted', id });
      },
      markNotificationRead: (id) => {
        dispatch({ type: 'notification/read', id });
      },
      markAllNotificationsRead: () => {
        dispatch({ type: 'notification/allRead' });
      },
      addPatient: (patient) => {
        dispatch({ type: 'patient/added', patient });
      },
      addDoctor: (doctor) => {
        dispatch({ type: 'doctor/added', doctor });
      },
      addClinic: (clinic) => {
        dispatch({ type: 'clinic/added', clinic });
      },
      updateSettings: (settings) => {
        dispatch({ type: 'settings/updated', settings });
      },
    }),
    [reload, simulateUpload]
  );

  return (
    <AppDataActionsContext.Provider value={actions}>
      <AppDataStateContext.Provider value={state}>{children}</AppDataStateContext.Provider>
    </AppDataActionsContext.Provider>
  );
}
