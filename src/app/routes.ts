/**
 * Route path constants (single source of truth for navigation).
 *
 * Paths match the Angular app.routes.ts.
 */

export const ROUTES = {
  root: '/',
  dashboard: '/dashboard',
  orders: '/orders',
  orderCreate: '/orders/create',
  orderDetails: (id = ':id') => `/orders/${id}`,
  orderEdit: (id = ':id') => `/orders/${id}/edit`,
  orderWorkflow: (id = ':id') => `/orders/${id}/workflow`,
  orderFiles: (id = ':id') => `/orders/${id}/files`,
  subOrder: (orderId = ':id', subOrderId = ':subOrderId') =>
    `/orders/${orderId}/sub-orders/${subOrderId}`,
  cases: '/cases',
  caseDetails: (id = ':caseId') => `/cases/${id}`,
  workflowBoard: '/workflow-board',
  scanCenter: '/scan-center',
  patients: '/patients',
  patientDetails: (id = ':patientId') => `/patients/${id}`,
  doctors: '/doctors',
  doctorDetails: (id = ':doctorId') => `/doctors/${id}`,
  clinics: '/clinics',
  clinicDetails: (id = ':clinicId') => `/clinics/${id}`,
  documents: '/documents',
  billing: '/billing',
  changeRequests: '/change-requests',
  reports: '/reports',
  reportsOrdersRange: '/reports/orders-range',
  reportsQuarterTargets: '/reports/quarterly-targets',
  reportsQuarterDetail: (year: number | string = ':year', quarter: number | string = ':quarter') =>
    `/reports/quarterly-targets/${String(year)}/${String(quarter)}`,
  reportsTeamPerformance: '/reports/team-performance',
  notifications: '/notifications',
  settings: '/settings',
  forms: '/forms',
  grid: '/grid',
  login: '/login',
  notFound: '*',
} as const;
