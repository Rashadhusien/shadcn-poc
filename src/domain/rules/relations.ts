/**
 * Entity relationships.
 *
 * Source: Angular `features/cases/case-relations.ts`, patient/doctor/clinic
 * detail components, and the `get*By*` service helpers.
 */

import type { Case, Doctor, LabDocument, Order, Patient } from '../models';

function normalize(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function timestamp(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

const newestFirst =
  <T>(at: (row: T) => string) =>
  (a: T, b: T) =>
    timestamp(at(b)) - timestamp(at(a));

/** A case's orders are the orders of its patient, newest update first. */
export function getCaseOrders(caseItem: Case, orders: readonly Order[]): Order[] {
  return orders
    .filter((order) => order.patientId === caseItem.patientId)
    .sort(newestFirst((order) => order.updatedAt));
}

/** Documents for the case patient or any of the case's orders. */
export function getCaseDocuments(
  caseItem: Case,
  caseOrders: readonly Order[],
  documents: readonly LabDocument[]
): LabDocument[] {
  const patient = normalize(caseItem.patientName);
  const orderIds = new Set(caseOrders.map((order) => order.id));
  return documents
    .filter(
      (doc) =>
        normalize(doc.patientName) === patient || (doc.orderId != null && orderIds.has(doc.orderId))
    )
    .sort(newestFirst((doc) => doc.date));
}

export function getPatientOrders(patient: Patient, orders: readonly Order[]): Order[] {
  return orders.filter((order) => order.patientId === patient.id);
}

export function getPatientCases(patient: Patient, cases: readonly Case[]): Case[] {
  return cases.filter((item) => item.patientId === patient.id);
}

/**
 * Documents shown on a patient profile: matched by patient name or by one
 * of the patient's orders.
 *
 * Fix (D2): Angular also matched documents by the patient's doctor, so every
 * patient of a doctor listed the others' files (a new patient showed 6).
 */
export function getPatientDocuments(
  patient: Patient,
  patientOrders: readonly Order[],
  documents: readonly LabDocument[]
): LabDocument[] {
  const name = normalize(patient.name);
  const orderIds = new Set(patientOrders.map((order) => order.id));
  return documents
    .filter(
      (doc) =>
        normalize(doc.patientName) === name || (doc.orderId != null && orderIds.has(doc.orderId))
    )
    .sort(newestFirst((doc) => doc.date));
}

export interface PatientActivityItem {
  kind: 'order' | 'case' | 'document';
  title: string;
  details: string;
  at: string;
  orderId?: string;
  caseId?: string;
}

/** Merged, newest-first timeline (max 20) for the patient Activity tab. */
export function getPatientActivity(
  orders: readonly Order[],
  cases: readonly Case[],
  documents: readonly LabDocument[]
): PatientActivityItem[] {
  return [
    ...orders.map((order) => ({
      kind: 'order' as const,
      title: `Order ${order.orderNumber}`,
      details: `${order.status} - ${order.restoration}`,
      at: order.updatedAt,
      orderId: order.id,
    })),
    ...cases.map((item) => ({
      kind: 'case' as const,
      title: `Case ${item.caseNumber}`,
      details: `${item.status} - ${item.title}`,
      at: item.updatedAt,
      caseId: item.id,
    })),
    ...documents.map((doc) => ({
      kind: 'document' as const,
      title: doc.name,
      details: `${doc.category} - ${doc.type} - ${doc.size}`,
      at: doc.date,
      orderId: doc.orderId,
    })),
  ]
    .sort(newestFirst((item) => item.at))
    .slice(0, 20);
}

export function getDoctorOrders(doctor: Doctor, orders: readonly Order[]): Order[] {
  return orders.filter((order) => order.doctorId === doctor.id);
}

export function getClinicDoctors(clinicId: string, doctors: readonly Doctor[]): Doctor[] {
  return doctors.filter((doctor) => doctor.clinicId === clinicId);
}
