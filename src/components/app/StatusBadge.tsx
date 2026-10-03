import { CheckCircle2, Circle, CircleAlert, CircleHelp, Clock, Info, Timer, type LucideIcon } from 'lucide-react'
import { getStatusPresentation, type StatusSemantic, type StatusValue } from '@/domain/status'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const SEMANTIC_ICON: Record<StatusSemantic, LucideIcon> = {
  neutral: Circle,
  info: Info,
  primary: Timer,
  warning: Clock,
  success: CheckCircle2,
  error: CircleAlert,
}

const SEMANTIC_BADGE: Record<StatusSemantic, 'neutral' | 'info' | 'success' | 'warning' | 'error'> = {
  neutral: 'neutral',
  info: 'info',
  primary: 'info',
  warning: 'warning',
  success: 'success',
  error: 'error',
}

interface StatusBadgeProps {
  status: StatusValue
  size?: 'sm' | 'md'
  loading?: boolean
}

/**
 * StatusBadge: icon + label pill. Status is never color-only: the mapping
 * lives in domain/status.ts and the pill always renders icon and label.
 */
export function StatusBadge({ status, size = 'md', loading = false }: StatusBadgeProps) {
  if (loading) {
    return (
      <Skeleton
        aria-label="Status loading"
        className={cn('w-[120px]', size === 'sm' ? 'h-6' : 'h-8')}
        role="status"
      />
    )
  }

  const meta = getStatusPresentation(status)
  const Icon = SEMANTIC_ICON[meta.semantic] ?? CircleHelp

  return (
    <Badge aria-label={`Status: ${meta.label}`} variant={SEMANTIC_BADGE[meta.semantic]}>
      <Icon aria-hidden="true" />
      {meta.label}
    </Badge>
  )
}
