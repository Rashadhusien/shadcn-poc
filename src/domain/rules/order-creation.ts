/**
 * Order creation: turns the seven-step wizard input into an order plus one
 * sub-order per service.
 *
 * Source: Angular `create-order.component.ts#submitOrder` and
 * `sub-order-data.service.ts#createForOrder`.
 */

import { findService } from '../catalog';
import type {
  Clinic,
  Doctor,
  Order,
  Patient,
  Priority,
  ScanCenter,
  SubOrder,
  SubOrderCreationData,
  SubOrderDetail,
} from '../models';
import {
  defaultDueDate,
  deriveArch,
  mapServiceToRestoration,
  nextOrderId,
  nextOrderNumber,
  orderAmountForServices,
} from './orders';
import {
  applyFormSave,
  buildSubOrdersForOrder,
  nextSubOrderSequence,
  refreshSubOrderCounts,
  type CreateSubOrderInput,
} from './sub-orders';

export interface OrderCreationService {
  serviceId: string;
  /** Teeth assigned to this service only; empty means "use all teeth". */
  teeth: number[];
  serviceDetails: Record<string, string>;
  serviceForm: Record<string, string>;
  /** File names attached per scan requirement in the Scans & Files step. */
  files: Record<string, string[]>;
}

export interface OrderCreationInput {
  patientId: string;
  doctorId: string;
  clinicId: string;
  /** Optional; Angular always used the first scan center. */
  scanCenterId?: string;
  priority: Priority;
  /** YYYY-MM-DD; empty defaults to today + 7 days. */
  dueDate: string;
  notes: string;
  shade: string;
  format: string;
  /** Teeth selected without a specific service. */
  sharedTeeth: number[];
  services: OrderCreationService[];
}

export interface OrderCreationContext {
  patients: readonly Patient[];
  doctors: readonly Doctor[];
  clinics: readonly Clinic[];
  scanCenters: readonly ScanCenter[];
  orders: readonly Order[];
  subOrders: readonly SubOrder[];
  now: Date;
}

export interface OrderCreationPlan {
  order: Order;
  subOrders: SubOrder[];
  details: SubOrderDetail[];
}

/** Wizard gate: step 1 needs patient, doctor, clinic; step 2 a service. */
export function canProceedFromStep(
  step: number,
  input: Pick<OrderCreationInput, 'patientId' | 'doctorId' | 'clinicId' | 'services'>
): boolean {
  if (step === 1) return Boolean(input.patientId && input.doctorId && input.clinicId);
  if (step === 2) return input.services.length > 0;
  return true;
}

export function stepValidationMessage(step: number): string {
  if (step === 1) return 'Select a patient, doctor and clinic to continue.';
  if (step === 2) return 'Select at least one service to continue.';
  return '';
}

/** Union of shared and per-service teeth, ascending. */
export function combinedTeeth(
  input: Pick<OrderCreationInput, 'sharedTeeth' | 'services'>
): number[] {
  const set = new Set<number>(input.sharedTeeth);
  input.services.forEach((service) => {
    service.teeth.forEach((tooth) => set.add(tooth));
  });
  return [...set].sort((a, b) => a - b);
}

/** Returns null when a required relation is missing (Angular early return). */
export function planOrderCreation(
  input: OrderCreationInput,
  context: OrderCreationContext
): OrderCreationPlan | null {
  const patient = context.patients.find((row) => row.id === input.patientId);
  const doctor = context.doctors.find((row) => row.id === input.doctorId);
  const clinic = context.clinics.find((row) => row.id === input.clinicId);
  const services = input.services.flatMap((row) => {
    const definition = findService(row.serviceId);
    return definition ? [{ row, definition }] : [];
  });
  const firstService = services.at(0);
  if (!patient || !doctor || !clinic || !firstService) return null;

  const nowIso = context.now.toISOString();
  const dueDate = input.dueDate || defaultDueDate(context.now);
  const allTeeth = combinedTeeth(input);
  const scanCenter =
    context.scanCenters.find((row) => row.id === input.scanCenterId) ?? context.scanCenters.at(0);

  const subOrderInputs: (CreateSubOrderInput & { files: Record<string, string[]> })[] =
    services.map(({ row, definition }) => {
      const selectedTeeth = row.teeth.length > 0 ? [...row.teeth] : [...allTeeth];
      const fileReferences = [...new Set(Object.values(row.files).flat())];
      const creationData: SubOrderCreationData = {
        serviceId: definition.id,
        serviceDetails: { ...row.serviceDetails },
        serviceForm: { ...row.serviceForm },
        selectedTeeth,
        scanRequirements: [...definition.scanRequirements],
        fileReferences,
      };
      const teethLabel = allTeeth.length > 0 ? `teeth ${allTeeth.join(', ')}` : 'no specific teeth';
      return {
        service: definition.name,
        icon: definition.icon,
        priority: input.priority,
        dueDate,
        notes:
          row.serviceDetails.serviceNotes ||
          input.notes ||
          `${definition.name} requested with ${teethLabel}.`,
        teeth: selectedTeeth,
        scanRequirements: [...definition.scanRequirements],
        creationData,
        files: row.files,
      };
    });

  const order: Order = {
    id: nextOrderId(context.orders),
    orderNumber: nextOrderNumber(context.orders),
    patientId: patient.id,
    patientName: patient.name,
    doctorId: doctor.id,
    doctorName: doctor.name,
    clinicId: clinic.id,
    clinicName: clinic.name,
    scanCenterId: scanCenter?.id ?? 'scan-local',
    scanCenterName: scanCenter?.name ?? 'Local Session',
    status: 'New',
    priority: input.priority,
    restoration: mapServiceToRestoration(firstService.definition.id),
    arch: deriveArch(allTeeth),
    format: input.format,
    shade: input.shade,
    units: Math.max(allTeeth.length, 1),
    amount: orderAmountForServices(services.length),
    billed: false,
    billTo: clinic.name,
    vouchers: 0,
    isLocked: false,
    hasNotes: input.notes.trim().length > 0,
    notes: input.notes,
    receivedAt: nowIso,
    updatedAt: nowIso,
    dueDate,
    creationData: { services: subOrderInputs.map((row) => structuredClone(row.creationData)) },
  };

  const built = buildSubOrdersForOrder(
    order.id,
    order.orderNumber,
    subOrderInputs,
    nextSubOrderSequence(context.subOrders),
    nowIso,
    (row, requirement) => row.files[requirement] ?? []
  );

  // Fix (Angular drops wizard form values): clinical notes entered in the
  // Forms step pre-fill the sub-order's clinical form, so it starts complete.
  const details = built.details.map((detail, index) => {
    const subOrder = built.subOrders[index];
    const input = subOrderInputs[index];
    const form = detail.forms.at(0);
    if (subOrder === undefined || input === undefined) return detail;
    const values = input.creationData.serviceForm;
    const clinicalNotes = (values.clinicalNotes as string | undefined) ?? '';
    if (!form || !clinicalNotes.trim()) return detail;
    return applyFormSave(
      detail,
      form.id,
      values,
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        subOrderId: subOrder.id,
        service: subOrder.service,
        patientName: order.patientName,
        doctorName: order.doctorName,
        clinicName: order.clinicName,
        selectedTeeth: [...subOrder.teeth],
        caseNotes: subOrder.notes,
      },
      nowIso
    );
  });
  const subOrders = built.subOrders.map((row, index) => {
    const detail = details[index];
    return detail === undefined ? row : refreshSubOrderCounts(row, detail);
  });
  return { order, subOrders, details };
}
