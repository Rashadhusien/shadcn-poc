/**
 * Business entity types — 1:1 with the Angular source (`src/app/core/models`).
 *
 * Field names and unions match the Angular JSON so the seed files load
 * without mapping. Presentation (labels, tones) lives in status.ts and
 * priority.ts, never here.
 */

import type { BusinessPriority } from './priority';

export type Priority = BusinessPriority;

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export const ORDER_STATUSES = [
  'New',
  'Review',
  'Design',
  'Production',
  'Quality Check',
  'Ready',
  'Completed',
  'Cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const RESTORATION_TYPES = [
  'Crown',
  'Bridge',
  'Veneer',
  'Implant Crown',
  'Full Arch',
  'Night Guard',
  'Inlay',
  'Onlay',
  'Partial Denture',
  'Complete Denture',
] as const;
export type RestoType = (typeof RESTORATION_TYPES)[number];

export const ARCH_TYPES = ['Maxilla', 'Mandible', 'Both'] as const;
export type ArchType = (typeof ARCH_TYPES)[number];

export interface Order {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName: string;
  scanCenterId: string;
  scanCenterName: string;
  status: OrderStatus;
  priority: Priority;
  restoration: RestoType;
  arch: ArchType;
  format: string;
  shade: string;
  units: number;
  amount: number;
  billed: boolean;
  billedAmount?: number;
  billTo: string;
  vouchers: number;
  isLocked: boolean;
  hasNotes: boolean;
  notes: string;
  archiveDate?: string | null;
  receivedAt: string;
  sentAt?: string | null;
  updatedAt: string;
  chargedAt?: string | null;
  dueDate: string;
  changeRequest?: string | null;
  csTask?: string | null;
  technicianId?: string;
  technicianName?: string;
  creationData?: { services: SubOrderCreationData[] };
}

/** A note added from the order view (Angular keeps these per session). */
export interface OrderNote {
  text: string;
  at: string;
}

export type OrderFileStatus = 'uploaded' | 'uploading' | 'failed';

/** Angular `OrderFileEntry` (order-files.component.ts). */
export interface OrderFile {
  id: string;
  name: string;
  type: string;
  size: string;
  sizeBytes: number;
  status: OrderFileStatus;
  progress: number;
  uploadedAt: string;
  uploadedBy: string;
}

// ---------------------------------------------------------------------------
// Sub-orders
// ---------------------------------------------------------------------------

export type SubOrderStatus = 'done' | 'in-progress' | 'pending' | 'blocked';

export interface SubOrderCreationData {
  serviceId: string;
  serviceDetails: Record<string, string>;
  serviceForm: Record<string, string>;
  selectedTeeth: number[];
  scanRequirements: string[];
  fileReferences: string[];
}

export interface SubOrder {
  id: string;
  orderId?: string;
  service: string;
  icon: string;
  status: SubOrderStatus;
  formsComplete: number;
  formsTotal: number;
  scansComplete: number;
  scansTotal: number;
  teeth: number[];
  priority: Priority;
  dueDate: string;
  notes: string;
  creationData?: SubOrderCreationData;
}

export type SubOrderFormItemStatus = 'complete' | 'incomplete' | 'optional';
export type SubOrderScanItemStatus = 'uploaded' | 'missing' | 'optional' | 'selected-local';

export interface SubOrderFormDraftValue {
  clinicalNotes: string;
  occlusalContact: string;
  marginType: string;
  material: string;
  shade: string;
  specialInstructions: string;
}

export interface SubOrderContextSnapshot {
  orderId: string;
  orderNumber: string;
  subOrderId: string;
  service: string;
  patientName: string;
  doctorName: string;
  clinicName: string;
  selectedTeeth: number[];
  caseNotes: string;
}

export interface SubOrderFormItemValue {
  values: SubOrderFormDraftValue;
  context: SubOrderContextSnapshot;
  updatedAt: string;
}

export interface SubOrderFormItem {
  id: string;
  label: string;
  required: boolean;
  status: SubOrderFormItemStatus;
  value?: SubOrderFormItemValue;
}

export interface SubOrderScanLocalFile {
  id: string;
  name: string;
  sizeBytes: number;
  sizeLabel: string;
  type: string;
  lastModified: number;
  selectedAt: string;
}

export interface SubOrderScanItem {
  id: string;
  label: string;
  format: string;
  status: SubOrderScanItemStatus;
  localFiles?: SubOrderScanLocalFile[];
  updatedAt?: string;
}

export interface SubOrderActivityItem {
  time: string;
  user: string;
  text: string;
}

export interface SubOrderDetail {
  id: string;
  forms: SubOrderFormItem[];
  scans: SubOrderScanItem[];
  activity: SubOrderActivityItem[];
}

export type SubOrderTab = 'overview' | 'forms' | 'scans' | 'activity';

// ---------------------------------------------------------------------------
// Directory
// ---------------------------------------------------------------------------

export type DirectoryStatus = 'Active' | 'Inactive';

export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  clinicId: string;
  clinicName: string;
  doctorId: string;
  doctorName: string;
  status: DirectoryStatus;
  ordersCount: number;
  lastVisit: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinicId: string;
  clinicName: string;
  email: string;
  phone: string;
  status: DirectoryStatus;
  ordersCount: number;
  joinedDate: string;
  avatar: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  doctorsCount: number;
  patientsCount: number;
  ordersCount: number;
  status: DirectoryStatus;
  accountManager: string;
}

export interface ScanCenter {
  id: string;
  name: string;
  location: string;
  operator: string;
  devices: number;
  activeOrders: number;
  completedToday: number;
  status: 'Operational' | 'Maintenance';
}

// ---------------------------------------------------------------------------
// Cases, billing, change requests
// ---------------------------------------------------------------------------

export const CASE_STATUSES = ['Open', 'In Progress', 'Review', 'Closed'] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName: string;
  status: CaseStatus;
  priority: Priority;
  ordersCount: number;
  filesCount: number;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export const BILLING_STATUSES = ['Pending', 'Invoiced', 'Paid', 'Overdue', 'Cancelled'] as const;
export type BillingStatus = (typeof BILLING_STATUSES)[number];

export interface BillingRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  patientName: string;
  doctorName: string;
  clinicName: string;
  amount: number;
  status: BillingStatus;
  invoiceNumber?: string | null;
  invoiceDate?: string | null;
  dueDate: string;
  paidDate?: string | null;
  vouchers: number;
  notes: string;
}

export const CHANGE_REQUEST_STATUSES = [
  'Pending',
  'In Review',
  'Approved',
  'Rejected',
  'Completed',
] as const;
export type ChangeRequestStatus = (typeof CHANGE_REQUEST_STATUSES)[number];

export interface ChangeRequest {
  id: string;
  requestNumber: string;
  orderId: string;
  orderNumber: string;
  patientName: string;
  requester: string;
  status: ChangeRequestStatus;
  priority: Priority;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Documents and notifications
// ---------------------------------------------------------------------------

export const DOCUMENT_CATEGORIES = [
  'Prescriptions',
  'Scan Files',
  'Patient Photos',
  'Invoices',
  'Reports',
] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export interface LabDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  type: string;
  size: string;
  date: string;
  doctor: string;
  patientName?: string;
  orderId?: string;
  orderNumber?: string;
  subOrderId?: string;
}

export type NotificationType = 'order' | 'workflow' | 'file' | 'billing' | 'system' | 'request';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
  relatedType?: string;
}

// ---------------------------------------------------------------------------
// Dashboard and reports
// ---------------------------------------------------------------------------

export interface VolumeDay {
  day: string;
  orders: number;
  completed: number;
}

export interface VolumeWeek {
  weekStart: string;
  weekLabel: string;
  days: VolumeDay[];
}

/**
 * Reporting seed (Angular public/data/reporting-seed.json): the inputs from
 * which the archive, monthly service metrics, quarters and team records are
 * generated (domain/rules/reporting.ts). Names are synthetic.
 */
export interface ReportingSeedData {
  startYear: number;
  endYear: number;
  services: { key: string; label: string; basePrice: number }[];
  scanCenters: string[];
  doctors: string[];
  patientsFirstNames: string[];
  patientsLastNames: string[];
  operators: string[];
  employeeTypes: string[];
  employeeNames: string[];
}

export const EMPTY_REPORTING_SEED: ReportingSeedData = {
  startYear: 0,
  endYear: 0,
  services: [],
  scanCenters: [],
  doctors: [],
  patientsFirstNames: [],
  patientsLastNames: [],
  operators: [],
  employeeTypes: [],
  employeeNames: [],
};

// ---------------------------------------------------------------------------
// Settings (Angular settings.component.ts form defaults)
// ---------------------------------------------------------------------------

export type Density = 'Compact' | 'Default' | 'Comfortable';

export interface NotificationPreferences {
  orderUpdates: boolean;
  changeRequests: boolean;
  billingAlerts: boolean;
  systemAlerts: boolean;
  weeklySummary: boolean;
}

export interface AppSettings {
  profile: { firstName: string; lastName: string; email: string; role: string; phone: string };
  notifications: NotificationPreferences;
  density: Density;
  language: { language: string; timeZone: string; dateFormat: string };
  twoFactor: boolean;
  organization: { labName: string; address: string; license: string };
}
