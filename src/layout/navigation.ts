import {
  ArrowLeftRight,
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  FolderOpen,
  LayoutDashboard,
  ReceiptText,
  ScanLine,
  Settings,
  Stethoscope,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@/app/routes'

export type NavBadge = 'openChangeRequests'

export interface NavEntry {
  label: string
  to: string
  icon: LucideIcon
  badge?: NavBadge
}

export interface NavGroup {
  label: string
  entries: NavEntry[]
}

/**
 * Primary navigation — the Angular `NAV_ITEMS` destinations, grouped.
 * Grid and Forms showcases stay out of the menu; their routes remain
 * reachable by URL. Notifications live behind the header bell.
 */
export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: 'Workspace',
    entries: [
      { label: 'Dashboard', to: ROUTES.dashboard, icon: LayoutDashboard },
      { label: 'Orders', to: ROUTES.orders, icon: ClipboardList },
      { label: 'Cases', to: ROUTES.cases, icon: FolderOpen },
      { label: 'Workflow Board', to: ROUTES.workflowBoard, icon: Workflow },
      { label: 'Scan Center', to: ROUTES.scanCenter, icon: ScanLine },
    ],
  },
  {
    label: 'Directory',
    entries: [
      { label: 'Patients', to: ROUTES.patients, icon: Users },
      { label: 'Doctors', to: ROUTES.doctors, icon: Stethoscope },
      { label: 'Clinics', to: ROUTES.clinics, icon: Building2 },
      { label: 'Documents', to: ROUTES.documents, icon: FileText },
    ],
  },
  {
    label: 'Operations',
    entries: [
      { label: 'Billing', to: ROUTES.billing, icon: ReceiptText },
      {
        label: 'Change Requests',
        to: ROUTES.changeRequests,
        icon: ArrowLeftRight,
        badge: 'openChangeRequests',
      },
      { label: 'Reports', to: ROUTES.reports, icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    entries: [{ label: 'Settings', to: ROUTES.settings, icon: Settings }],
  },
]
