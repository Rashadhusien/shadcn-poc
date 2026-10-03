/**
 * Fixtures the Angular source defines in code rather than JSON:
 * - sub-order details for so-1..so-4 (sub-order-data.service.ts)
 * - the order file list (order-files.component.ts INITIAL_FILES)
 * - settings form defaults (settings.component.ts)
 *
 * Mock data only; no real people.
 */

import type { AppSettings, OrderFile, SubOrderDetail } from '@/domain/models';

export const SUB_ORDER_DETAIL_FIXTURES: Readonly<Record<string, SubOrderDetail>> = {
  'so-1': {
    id: 'so-1',
    forms: [
      { id: 'f1', label: 'Implant System & Diameter', required: true, status: 'complete' },
      { id: 'f2', label: 'Bone Quality Assessment', required: true, status: 'complete' },
      { id: 'f3', label: 'Surgical Protocol Notes', required: true, status: 'complete' },
    ],
    scans: [
      { id: 's1', label: 'CBCT / CT Scan', format: 'DICOM', status: 'uploaded' },
      { id: 's2', label: 'Full Arch STL', format: 'STL', status: 'uploaded' },
      { id: 's3', label: 'Supporting Reference Files', format: 'PDF / JPG', status: 'uploaded' },
    ],
    activity: [
      { time: '2 hours ago', user: 'Jessica R.', text: 'Surgical guide approved and sent to fabrication.' },
      { time: '1 day ago', user: 'Tom K.', text: 'CBCT scan uploaded and reviewed.' },
      { time: '3 days ago', user: 'Jessica R.', text: 'Sub-order created from parent order.' },
    ],
  },
  'so-2': {
    id: 'so-2',
    forms: [
      { id: 'f1', label: 'Occlusal Concept Form', required: true, status: 'complete' },
      { id: 'f2', label: 'VDO Change Documentation', required: true, status: 'complete' },
      { id: 'f3', label: 'Clinical Notes & Photos', required: true, status: 'incomplete' },
    ],
    scans: [
      { id: 's1', label: 'Upper Arch Scan', format: 'STL', status: 'uploaded' },
      { id: 's2', label: 'Lower Arch Scan', format: 'STL', status: 'uploaded' },
      { id: 's3', label: 'Bite Scan', format: 'STL', status: 'missing' },
    ],
    activity: [
      { time: '30 min ago', user: 'Jessica R.', text: 'Bite scan still pending from clinic. Sent reminder to Dr. Kim.' },
      { time: '2 days ago', user: 'Tom K.', text: 'Upper and lower arch scans uploaded successfully.' },
      { time: '4 days ago', user: 'Jessica R.', text: 'GFMR sub-order created.' },
    ],
  },
  'so-3': {
    id: 'so-3',
    forms: [
      { id: 'f1', label: 'Shade & Material Selection', required: true, status: 'incomplete' },
      { id: 'f2', label: 'Margin & Occlusion Specs', required: true, status: 'incomplete' },
    ],
    scans: [
      { id: 's1', label: 'Prep Scan', format: 'STL', status: 'missing' },
      { id: 's2', label: 'Antagonist Scan', format: 'STL', status: 'missing' },
    ],
    activity: [
      { time: '5 days ago', user: 'Jessica R.', text: 'Final Restoration sub-order created. Waiting for scans from clinic.' },
    ],
  },
  'so-4': {
    id: 'so-4',
    forms: [
      { id: 'f1', label: 'Patient History Summary', required: true, status: 'complete' },
      { id: 'f2', label: 'Proposed Treatment Outline', required: true, status: 'incomplete' },
    ],
    scans: [{ id: 's1', label: 'Diagnostic Model Scan', format: 'STL', status: 'missing' }],
    activity: [{ time: '1 week ago', user: 'Jessica R.', text: 'Treatment Plan sub-order created.' }],
  },
};

const INITIAL_ORDER_FILES: readonly Omit<OrderFile, 'id'>[] = [
  { name: 'upper_arch_scan.stl', type: 'STL', size: '4.2 MB', sizeBytes: 4404019, status: 'uploaded', progress: 100, uploadedAt: '2024-03-01', uploadedBy: 'Dr. Smith' },
  { name: 'lower_arch_scan.stl', type: 'STL', size: '3.8 MB', sizeBytes: 3984589, status: 'uploaded', progress: 100, uploadedAt: '2024-03-01', uploadedBy: 'Dr. Smith' },
  { name: 'bite_registration.stl', type: 'STL', size: '1.2 MB', sizeBytes: 1258291, status: 'uploaded', progress: 100, uploadedAt: '2024-03-02', uploadedBy: 'Lab Tech' },
  { name: 'patient_photo_front.jpg', type: 'JPG', size: '2.8 MB', sizeBytes: 2936012, status: 'uploaded', progress: 100, uploadedAt: '2024-03-02', uploadedBy: 'Clinic' },
  { name: 'shade_guide_reference.jpg', type: 'JPG', size: '1.6 MB', sizeBytes: 1677721, status: 'uploaded', progress: 100, uploadedAt: '2024-03-03', uploadedBy: 'Clinic' },
  { name: 'rx_prescription.pdf', type: 'PDF', size: '380 KB', sizeBytes: 389120, status: 'uploaded', progress: 100, uploadedAt: '2024-03-03', uploadedBy: 'Dr. Smith' },
];

/** Seeded orders start with the Angular file list; ids are per order. */
export function initialOrderFiles(orderId: string): OrderFile[] {
  return INITIAL_ORDER_FILES.map((file, index) => ({
    ...file,
    id: `${orderId}-f${String(index + 1)}`,
  }));
}

export const DEFAULT_SETTINGS: AppSettings = {
  profile: {
    firstName: 'Jessica',
    lastName: 'Ruiz',
    email: 'jessica.ruiz@dentalab.com',
    role: 'Lab Manager',
    phone: '+1 (415) 555-0132',
  },
  notifications: {
    orderUpdates: true,
    changeRequests: true,
    billingAlerts: true,
    systemAlerts: false,
    weeklySummary: true,
  },
  density: 'Default',
  language: { language: 'en', timeZone: 'PST', dateFormat: 'MM/DD/YYYY' },
  twoFactor: false,
  organization: {
    labName: 'DentaLab Systems Inc.',
    address: '548 Market Street, San Francisco, CA',
    license: 'DL-CA-2019-04821',
  },
};
