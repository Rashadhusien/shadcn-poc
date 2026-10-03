import { Suspense, lazy, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '@/app/AppShell'
import { AuthBoundary } from '@/app/AuthBoundary'
import { RouteErrorBoundary } from '@/app/RouteErrorBoundary'
import { ROUTES } from '@/app/routes'

const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const ThemeCheckPage = lazy(() => import('@/features/dev/ThemeCheckPage'))
const NotFoundPage = lazy(() =>
  import('@/features/errors/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)
const StubPage = lazy(() =>
  import('@/features/stubs/StubPage').then((module) => ({ default: module.StubPage })),
)

function RouteFallback() {
  return (
    <div className="py-10" role="status" aria-label="Loading page">
      <div className="bg-muted h-8 w-48 animate-pulse rounded-lg" />
      <div className="bg-muted mt-4 h-40 animate-pulse rounded-2xl" />
    </div>
  )
}

/** Per-route error boundary (resets on navigation) + suspense. */
function RouteElement({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <RouteErrorBoundary key={pathname}>
      <Suspense fallback={<RouteFallback />}>{children}</Suspense>
    </RouteErrorBoundary>
  )
}

function stub(title: string, phase: string) {
  return (
    <RouteElement>
      <StubPage title={title} phase={phase} />
    </RouteElement>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        element={
          <RouteElement>
            <LoginPage />
          </RouteElement>
        }
        path={ROUTES.login}
      />
      <Route
        element={
          <RouteElement>
            <ThemeCheckPage />
          </RouteElement>
        }
        path="/dev/theme-check"
      />
      <Route
        element={
          <AuthBoundary>
            <AppShell />
          </AuthBoundary>
        }
        path={ROUTES.root}
      >
        <Route element={<Navigate replace to={ROUTES.dashboard} />} index />
        <Route element={stub('Dashboard', 'Phase 07')} path="dashboard" />
        <Route element={stub('Orders', 'Phase 06')} path="orders" />
        <Route element={stub('Create order', 'Phase 09')} path="orders/create" />
        <Route element={stub('Order details', 'Phase 08')} path="orders/:id" />
        <Route element={stub('Edit order', 'Phase 09')} path="orders/:id/edit" />
        <Route element={stub('Order workflow', 'Phase 08')} path="orders/:id/workflow" />
        <Route element={stub('Order files', 'Phase 08')} path="orders/:id/files" />
        <Route element={stub('Sub-order', 'Phase 08')} path="orders/:id/sub-orders/:subOrderId" />
        <Route element={stub('Cases', 'Phase 10')} path="cases" />
        <Route element={stub('Case details', 'Phase 10')} path="cases/:caseId" />
        <Route element={stub('Workflow board', 'Phase 10')} path="workflow-board" />
        <Route element={stub('Scan center', 'Phase 10')} path="scan-center" />
        <Route element={stub('Patients', 'Phase 10')} path="patients" />
        <Route element={stub('Patient details', 'Phase 10')} path="patients/:patientId" />
        <Route element={stub('Doctors', 'Phase 10')} path="doctors" />
        <Route element={stub('Doctor details', 'Phase 10')} path="doctors/:doctorId" />
        <Route element={stub('Clinics', 'Phase 10')} path="clinics" />
        <Route element={stub('Clinic details', 'Phase 10')} path="clinics/:clinicId" />
        <Route element={stub('Documents', 'Phase 10')} path="documents" />
        <Route element={stub('Billing', 'Phase 10')} path="billing" />
        <Route element={stub('Change requests', 'Phase 10')} path="change-requests" />
        <Route element={stub('Reports', 'Phase 10')} path="reports" />
        <Route element={stub('Orders by date', 'Phase 10')} path="reports/orders-range" />
        <Route element={stub('Quarter targets', 'Phase 10')} path="reports/quarterly-targets" />
        <Route
          element={stub('Quarter detail', 'Phase 10')}
          path="reports/quarterly-targets/:year/:quarter"
        />
        <Route element={stub('Team performance', 'Phase 10')} path="reports/team-performance" />
        <Route element={stub('Notifications', 'Phase 10')} path="notifications" />
        <Route element={stub('Settings', 'Phase 10')} path="settings" />
        <Route element={stub('Forms showcase', 'Phase 10')} path="forms" />
        <Route element={stub('Grid showcase', 'Phase 10')} path="grid" />
        <Route
          element={
            <RouteElement>
              <NotFoundPage />
            </RouteElement>
          }
          path="*"
        />
      </Route>
    </Routes>
  )
}
