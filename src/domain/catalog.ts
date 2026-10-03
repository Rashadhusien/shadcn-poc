/**
 * Business catalogs and option lists — one copy of every constant the
 * Angular source spread across models and components
 * (create-order.model.ts, create-order / edit-order / sub-order /
 * order-workflow components, tooth.model.ts, sub-order-data.service.ts).
 */

import type { OrderStatus } from './models';

export interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  scanRequirements: string[];
}

export const AVAILABLE_SERVICES: readonly ServiceDefinition[] = [
  {
    id: 'treatment-plan',
    name: 'Treatment Plan',
    description: 'Comprehensive treatment planning with diagnostic data and clinical workflow.',
    icon: '📋',
    scanRequirements: ['Full arch STL', 'Bite registration'],
  },
  {
    id: 'surgical-guide',
    name: 'Surgical Guide',
    description: 'Precision-guided implant surgery using CT and digital planning.',
    icon: '🦷',
    scanRequirements: ['CBCT / CT scan', 'STL dental model', 'Supporting reference files'],
  },
  {
    id: 'gfmr',
    name: 'GFMR',
    description: 'Full-mouth rehabilitation with a guided functional occlusal approach.',
    icon: '⚙️',
    scanRequirements: ['Upper arch scan', 'Lower arch scan', 'Bite scan'],
  },
  {
    id: 'fmb',
    name: 'FMB / FMP',
    description: 'Full-mouth bridge or partial restoration fabricated to precision.',
    icon: '🔬',
    scanRequirements: ['Upper arch STL', 'Lower arch STL'],
  },
  {
    id: 'temp-restoration',
    name: 'Temporary Restoration',
    description: 'Interim restorations to protect and maintain occlusion during treatment.',
    icon: '🛡️',
    scanRequirements: ['Working model scan', 'Antagonist scan'],
  },
  {
    id: 'final-restoration',
    name: 'Final Restoration',
    description: 'Definitive crowns, bridges, veneers, or full-arch restorations.',
    icon: '✨',
    scanRequirements: ['Prep scan', 'Antagonist scan', 'Shade reference photo'],
  },
  {
    id: 'full-guide',
    name: 'Full Guide Case',
    description: 'End-to-end digital workflow with guided surgery and final prosthetics.',
    icon: '🔑',
    scanRequirements: ['CBCT / CT scan', 'Full arch STL', 'Diagnostic model', 'Bite registration'],
  },
  {
    id: 'other',
    name: 'Other Service',
    description: 'Custom lab service or specialized dental work not listed above.',
    icon: '➕',
    scanRequirements: ['As specified'],
  },
];

export function findService(serviceId: string): ServiceDefinition | undefined {
  return AVAILABLE_SERVICES.find((service) => service.id === serviceId);
}

/** Services whose detail step asks for shade and arch (create-order). */
export const SHADE_ARCH_SERVICE_IDS: readonly string[] = [
  'fmb',
  'final-restoration',
  'temp-restoration',
];

export const CREATE_ORDER_STEPS = [
  { id: 1, label: 'Patient & Clinic', short: 'Patient' },
  { id: 2, label: 'Services', short: 'Services' },
  { id: 3, label: 'Teeth Selection', short: 'Teeth' },
  { id: 4, label: 'Service Details', short: 'Details' },
  { id: 5, label: 'Forms', short: 'Forms' },
  { id: 6, label: 'Scans & Files', short: 'Files' },
  { id: 7, label: 'Review', short: 'Review' },
] as const;

export const SHADE_OPTIONS = ['A1', 'A2', 'A3', 'A3.5', 'B1', 'B2', 'C2', 'D3', 'BL1', 'BL2'];
export const FORMAT_OPTIONS = ['STL', 'PLY', 'OBJ', 'DICOM', 'STL+OBJ'];
export const SERVICE_ARCH_OPTIONS = ['Maxilla (Upper)', 'Mandible (Lower)', 'Both'];
export const ARCH_SELECT_OPTIONS = [
  { value: 'Maxilla', label: 'Maxilla (Upper)' },
  { value: 'Mandible', label: 'Mandible (Lower)' },
  { value: 'Both', label: 'Both Arches' },
] as const;
/** Edit-order restoration choices (Angular edit form offers the first eight). */
export const EDITABLE_RESTORATIONS = [
  'Crown',
  'Bridge',
  'Veneer',
  'Implant Crown',
  'Full Arch',
  'Night Guard',
  'Inlay',
  'Onlay',
] as const;
export const OCCLUSAL_CONCEPTS = ['Mutually Protected', 'Group Function', 'Full Balanced'];
export const IMPLANT_SYSTEMS = ['Straumann', 'Nobel Biocare', 'Zimmer Biomet', 'Neodent', 'Other'];
export const OCCLUSAL_CONTACTS = ['Light contact', 'Full contact', 'No contact'];
export const MARGIN_TYPES = ['Chamfer', 'Shoulder', 'Feather edge', 'Knife edge'];
export const MATERIALS = ['Zirconia (Multilayer)', 'PFM', 'E-max', 'PMMA', 'Titanium'];

// ---------------------------------------------------------------------------
// Order workflow (order-workflow.component.ts)
// ---------------------------------------------------------------------------

export interface WorkflowStageDefinition {
  status: OrderStatus;
  label: string;
  owner: string;
  description: string;
  actions: string[];
}

/** Ordered lifecycle; Cancelled is terminal and outside the flow. */
export const ORDER_STAGE_FLOW: readonly OrderStatus[] = [
  'New',
  'Review',
  'Design',
  'Production',
  'Quality Check',
  'Ready',
  'Completed',
];

export const WORKFLOW_STAGES: readonly WorkflowStageDefinition[] = [
  {
    status: 'New',
    label: 'Order Received',
    owner: 'Reception',
    description: 'Order intake and initial verification.',
    actions: ['Verify scan files', 'Confirm patient details', 'Set priority'],
  },
  {
    status: 'Review',
    label: 'Technical Review',
    owner: 'Lead Technician',
    description: 'Validate scan quality and prescription.',
    actions: ['Review STL quality', 'Validate occlusal data', 'Confirm shade selection'],
  },
  {
    status: 'Design',
    label: 'CAD Design',
    owner: 'T. Anderson',
    description: 'Digital design and margin placement.',
    actions: ['Create initial design', 'Margin placement', 'Patient approval (if needed)'],
  },
  {
    status: 'Production',
    label: 'Milling / Fabrication',
    owner: 'M. Rivera',
    description: 'Manufacturing and post-processing.',
    actions: ['Queue milling job', 'Monitor production', 'Post-process'],
  },
  {
    status: 'Quality Check',
    label: 'Quality Control',
    owner: 'QC Team',
    description: 'Final inspection before dispatch.',
    actions: ['Occlusal check', 'Shade verification', 'Surface finish inspection'],
  },
  {
    status: 'Ready',
    label: 'Ready for Pickup',
    owner: 'Dispatch',
    description: 'Packaging and clinic notification.',
    actions: ['Package order', 'Notify clinic', 'Arrange delivery'],
  },
  {
    status: 'Completed',
    label: 'Completed',
    owner: 'Completed',
    description: 'Order delivered and closed.',
    actions: [],
  },
];

// ---------------------------------------------------------------------------
// Sub-orders (sub-order-data.service.ts)
// ---------------------------------------------------------------------------

/** Seed icon keys -> display symbol. */
export const SUB_ORDER_ICON_MAP: Readonly<Record<string, string>> = {
  tooth: '🦷',
  settings: '⚙️',
  sparkles: '✨',
  clipboard: '📋',
};

export const DEFAULT_SUB_ORDER_FORM_VALUES = {
  clinicalNotes: '',
  occlusalContact: 'Light contact',
  marginType: 'Chamfer',
  material: 'Zirconia (Multilayer)',
  shade: 'A2',
  specialInstructions: '',
} as const;

/** Current user shown on activity notes and uploads (Angular mock user). */
export const CURRENT_USER = {
  name: 'Jessica Ruiz',
  initials: 'JR',
  role: 'Lab Manager',
  email: 'jessica.ruiz@dentalab.com',
} as const;

// ---------------------------------------------------------------------------
// Create-order defaults (create-order.component.ts defaultDetail /
// defaultClinicalForm)
// ---------------------------------------------------------------------------

export const DEFAULT_SERVICE_DETAILS: Readonly<Record<string, string>> = {
  shade: 'A2',
  arch: 'Both',
  occlusalConcept: 'Mutually Protected',
  implantSystem: 'Straumann',
  fileFormat: 'STL',
  serviceNotes: '',
};

export const DEFAULT_CLINICAL_FORM: Readonly<Record<string, string>> = {
  clinicalNotes: '',
  occlusalContact: 'Light contact',
  marginType: 'Chamfer',
  material: 'Zirconia (Multilayer)',
  specialInstructions: '',
};
