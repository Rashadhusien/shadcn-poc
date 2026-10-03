/**
 * Directory rules: patients, doctors, clinics, cases, scan centers.
 *
 * Source: Angular patients / doctors / clinics / cases / scan-center
 * components and their add dialogs.
 *
 * Fix (D2/D5): the seeds store order, doctor, and patient counts that do
 * not match the data (a patient "with 5 orders" has 1; a doctor "with 87"
 * has 10) and never change when records are added. Counts are derived from
 * the data instead, as Angular already did for cases (`caseMetrics`).
 */

import type {
  Case,
  Clinic,
  Doctor,
  DirectoryStatus,
  LabDocument,
  Order,
  Patient,
  ScanCenter,
} from '../models';
import { getCaseDocuments, getCaseOrders, type PatientActivityItem } from './relations';

export const DIRECTORY_STATUSES: readonly DirectoryStatus[] = ['Active', 'Inactive'];

export const DOCTOR_SPECIALTIES = [
  'General Dentistry',
  'Prosthodontics',
  'Orthodontics',
  'Endodontics',
  'Periodontics',
  'Oral Surgery',
  'Pediatric Dentistry',
] as const;

function countBy<T>(rows: readonly T[], key: (row: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const id = key(row);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  });
  return counts;
}

export interface DirectoryCounts {
  ordersByPatient: ReadonlyMap<string, number>;
  ordersByDoctor: ReadonlyMap<string, number>;
  ordersByClinic: ReadonlyMap<string, number>;
  doctorsByClinic: ReadonlyMap<string, number>;
  patientsByClinic: ReadonlyMap<string, number>;
  patientsByDoctor: ReadonlyMap<string, number>;
}

export function directoryCounts(
  orders: readonly Order[],
  patients: readonly Patient[],
  doctors: readonly Doctor[]
): DirectoryCounts {
  return {
    ordersByPatient: countBy(orders, (order) => order.patientId),
    ordersByDoctor: countBy(orders, (order) => order.doctorId),
    ordersByClinic: countBy(orders, (order) => order.clinicId),
    doctorsByClinic: countBy(doctors, (doctor) => doctor.clinicId),
    patientsByClinic: countBy(patients, (patient) => patient.clinicId),
    patientsByDoctor: countBy(patients, (patient) => patient.doctorId),
  };
}

/** Orders and files per case (Angular cases.component caseMetrics). */
export function caseMetrics(
  cases: readonly Case[],
  orders: readonly Order[],
  documents: readonly LabDocument[]
): ReadonlyMap<string, { ordersCount: number; filesCount: number }> {
  return new Map(
    cases.map((item) => {
      const caseOrders = getCaseOrders(item, orders);
      return [
        item.id,
        {
          ordersCount: caseOrders.length,
          filesCount: getCaseDocuments(item, caseOrders, documents).length,
        },
      ];
    })
  );
}

const byNewest = (a: PatientActivityItem, b: PatientActivityItem) =>
  Date.parse(b.at) - Date.parse(a.at);

/** Doctor / clinic activity: their orders, newest update first (max 20). */
export function getOrderActivity(orders: readonly Order[]): PatientActivityItem[] {
  return orders
    .map((order) => ({
      kind: 'order' as const,
      title: `Order ${order.orderNumber}`,
      details: `${order.patientName} · ${order.status} · ${order.restoration}`,
      at: order.updatedAt,
      orderId: order.id,
    }))
    .sort(byNewest)
    .slice(0, 20);
}

/**
 * Case activity. Fix (D5): Angular showed three invented entries ("K. Patel
 * uploaded…"); the feed is now the case's own events — created, its orders,
 * and its files.
 */
export function getCaseActivity(
  caseItem: Case,
  caseOrders: readonly Order[],
  caseFiles: readonly LabDocument[]
): PatientActivityItem[] {
  return [
    {
      kind: 'case' as const,
      title: `Case ${caseItem.caseNumber} created`,
      details: caseItem.title,
      at: caseItem.createdAt,
      caseId: caseItem.id,
    },
    ...caseOrders.map((order) => ({
      kind: 'order' as const,
      title: `Order ${order.orderNumber}`,
      details: `${order.status} · ${order.restoration}`,
      at: order.updatedAt,
      orderId: order.id,
    })),
    ...caseFiles.map((doc) => ({
      kind: 'document' as const,
      title: doc.name,
      details: `${doc.category} · ${doc.type} · ${doc.size}`,
      at: doc.date,
      orderId: doc.orderId,
    })),
  ]
    .sort(byNewest)
    .slice(0, 20);
}

export function scanCenterTotals(centers: readonly ScanCenter[]) {
  return {
    operational: centers.filter((center) => center.status === 'Operational').length,
    devices: centers.reduce((sum, center) => sum + center.devices, 0),
    activeOrders: centers.reduce((sum, center) => sum + center.activeOrders, 0),
    completedToday: centers.reduce((sum, center) => sum + center.completedToday, 0),
  };
}

// ---------------------------------------------------------------------------
// Add dialogs
// ---------------------------------------------------------------------------

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s().-]{6,}$/;

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

function contactErrors(email: string, phone: string): FieldErrors<'email' | 'phone'> {
  const errors: FieldErrors<'email' | 'phone'> = {};
  if (email.trim() && !EMAIL.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (phone.trim() && !PHONE.test(phone.trim())) errors.phone = 'Enter a valid phone number.';
  return errors;
}

export interface NewPatientValues {
  name: string;
  dob: string;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  clinicId: string;
  doctorId: string;
}

/**
 * Fix (D2): Angular saved every new patient with clinic `cl1` and doctor
 * `dr1` whatever clinic was chosen, a fixed DOB, and placeholder contact
 * details. Name, clinic and doctor are now required, and contacts validated.
 */
export function validateNewPatient(
  values: NewPatientValues,
  today: string
): FieldErrors<keyof NewPatientValues> {
  const errors: FieldErrors<keyof NewPatientValues> = contactErrors(values.email, values.phone);
  if (!values.name.trim()) errors.name = 'Enter the patient name.';
  if (values.dob && values.dob > today) errors.dob = 'Date of birth cannot be in the future.';
  if (!values.clinicId) errors.clinicId = 'Select a clinic.';
  if (!values.doctorId) errors.doctorId = 'Select a doctor.';
  return errors;
}

export function buildPatient(
  id: string,
  values: NewPatientValues,
  clinics: readonly Clinic[],
  doctors: readonly Doctor[],
  today: string
): Patient {
  return {
    id,
    name: values.name.trim(),
    dob: values.dob,
    gender: values.gender,
    phone: values.phone.trim(),
    email: values.email.trim(),
    clinicId: values.clinicId,
    clinicName: clinics.find((row) => row.id === values.clinicId)?.name ?? '',
    doctorId: values.doctorId,
    doctorName: doctors.find((row) => row.id === values.doctorId)?.name ?? '',
    status: 'Active',
    ordersCount: 0,
    lastVisit: today,
  };
}

export interface NewDoctorValues {
  name: string;
  specialty: string;
  clinicId: string;
  email: string;
  phone: string;
}

export function validateNewDoctor(values: NewDoctorValues): FieldErrors<keyof NewDoctorValues> {
  const errors: FieldErrors<keyof NewDoctorValues> = contactErrors(values.email, values.phone);
  if (!values.name.trim().replace(/^Dr\.\s*/, '')) errors.name = 'Enter the doctor name.';
  if (!values.clinicId) errors.clinicId = 'Select a clinic.';
  return errors;
}

/** "Dr." prefix and avatar initials as in Angular saveDoctor. */
export function buildDoctor(
  id: string,
  values: NewDoctorValues,
  clinics: readonly Clinic[],
  today: string
): Doctor {
  const bare = values.name.trim().replace(/^Dr\.\s*/, '');
  return {
    id,
    name: `Dr. ${bare}`,
    specialty: values.specialty,
    clinicId: values.clinicId,
    clinicName: clinics.find((row) => row.id === values.clinicId)?.name ?? '',
    email: values.email.trim(),
    phone: values.phone.trim(),
    status: 'Active',
    ordersCount: 0,
    joinedDate: today,
    avatar: bare
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  };
}

export interface NewClinicValues {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  accountManager: string;
}

export function validateNewClinic(values: NewClinicValues): FieldErrors<keyof NewClinicValues> {
  const errors: FieldErrors<keyof NewClinicValues> = contactErrors(values.email, values.phone);
  if (!values.name.trim()) errors.name = 'Enter the clinic name.';
  if (!values.city.trim()) errors.city = 'Enter the city.';
  return errors;
}

export function buildClinic(id: string, values: NewClinicValues): Clinic {
  return {
    id,
    name: values.name.trim(),
    address: values.address.trim(),
    city: values.city.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    doctorsCount: 0,
    patientsCount: 0,
    ordersCount: 0,
    status: 'Active',
    accountManager: values.accountManager.trim(),
  };
}
