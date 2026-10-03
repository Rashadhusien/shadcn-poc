import { Navigate, Route, Routes } from 'react-router-dom'
import ThemeCheckPage from '@/features/dev/ThemeCheckPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/dev/theme-check" />} path="/" />
      <Route element={<ThemeCheckPage />} path="/dev/theme-check" />
      <Route element={<Navigate replace to="/dev/theme-check" />} path="*" />
    </Routes>
  )
}
