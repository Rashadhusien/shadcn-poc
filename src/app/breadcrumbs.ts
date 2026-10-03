/**
 * Breadcrumb trails per route.
 *
 * Source: Angular `navigation.model.ts#BREADCRUMB_MAP` and
 * `navigation.service.ts#breadcrumbs` (page -> parent chain).
 *
 * Enhancement: detail crumbs name the record ("DL-024001", "Alice
 * Johnson") instead of Angular's generic "View Order" / "Patient Details",
 * falling back to those labels while data loads.
 */

import type { AppDataState } from '@/data/app-data-reducer';

export interface Crumb {
  label: string;
  /** Omitted for the current page. */
  to?: string;
}

type Lookup = Pick<
  AppDataState,
  'orders' | 'subOrders' | 'patients' | 'doctors' | 'clinics' | 'cases'
>;

const SECTIONS: Record<string, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  cases: 'Cases',
  'workflow-board': 'Workflow Board',
  'scan-center': 'Scan Center',
  patients: 'Patients',
  doctors: 'Doctors',
  clinics: 'Clinics',
  documents: 'Documents',
  billing: 'Billing',
  'change-requests': 'Change Requests',
  reports: 'Reports',
  notifications: 'Notifications',
  settings: 'Settings',
  grid: 'Grid',
  forms: 'Forms',
};

const REPORT_PAGES: Record<string, string> = {
  'orders-range': 'Orders by Date',
  'quarterly-targets': 'Quarter Targets',
  'team-performance': 'Team Performance',
};

const ORDER_CHILDREN: Record<string, string> = {
  edit: 'Edit Order',
  workflow: 'Workflow',
  files: 'Files',
};

function detailLabel(section: string, id: string, data: Lookup): string {
  switch (section) {
    case 'cases':
      return data.cases.find((row) => row.id === id)?.caseNumber ?? 'Case Details';
    case 'patients':
      return data.patients.find((row) => row.id === id)?.name ?? 'Patient Details';
    case 'doctors':
      return data.doctors.find((row) => row.id === id)?.name ?? 'Doctor Details';
    case 'clinics':
      return data.clinics.find((row) => row.id === id)?.name ?? 'Clinic Details';
    default:
      return id;
  }
}

export function buildBreadcrumbs(pathname: string, data: Lookup): Crumb[] {
  const [section = 'dashboard', id, child, childId] = pathname.split('/').filter(Boolean);
  const sectionLabel = SECTIONS[section] as string | undefined;
  if (sectionLabel == null) return [{ label: 'Page Not Found' }];
  const root: Crumb = { label: sectionLabel, to: `/${section}` };

  if (section === 'orders' && id) {
    if (id === 'create') return [root, { label: 'Create Order' }];
    const orderLabel = data.orders.find((row) => row.id === id)?.orderNumber ?? 'View Order';
    const orderCrumb: Crumb = { label: orderLabel, to: `/orders/${id}` };
    if (child === 'sub-orders' && childId) {
      const service = data.subOrders.find((row) => row.id === childId)?.service;
      return [root, orderCrumb, { label: service ?? 'Sub-Order' }];
    }
    const childLabel = child ? ORDER_CHILDREN[child] : undefined;
    if (childLabel) return [root, orderCrumb, { label: childLabel }];
    return [root, { label: orderLabel }];
  }
  if (section === 'reports' && id) {
    const page = REPORT_PAGES[id] as string | undefined;
    if (page == null) return [{ label: 'Page Not Found' }];
    if (id === 'quarterly-targets' && child && childId) {
      return [
        root,
        { label: page, to: '/reports/quarterly-targets' },
        { label: `Q${childId} ${child}` },
      ];
    }
    return [root, { label: page }];
  }
  if (id) return [root, { label: detailLabel(section, id, data) }];
  return [{ label: sectionLabel }];
}
