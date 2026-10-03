/**
 * Notification type presentation (Angular notifications.component.ts
 * TYPE_STYLES), mapped onto the shared tone scale.
 */

import type { AppNotification, NotificationType } from './models';
import type { StatusSemantic } from './status';

export const NOTIFICATION_TYPE_META: Record<
  NotificationType,
  { label: string; semantic: StatusSemantic }
> = {
  order: { label: 'Order', semantic: 'info' },
  workflow: { label: 'Workflow', semantic: 'primary' },
  file: { label: 'File', semantic: 'success' },
  billing: { label: 'Billing', semantic: 'warning' },
  request: { label: 'Change request', semantic: 'primary' },
  system: { label: 'System', semantic: 'neutral' },
};

/**
 * Where a notification leads: its order when it names one; otherwise the
 * list for its type (Angular sent everything without an order id to the
 * notifications page).
 */
export function notificationTarget(notification: AppNotification): string {
  if (notification.relatedType === 'order' && notification.relatedId) {
    return `/orders/${notification.relatedId}`;
  }
  if (notification.type === 'request') return '/change-requests';
  if (notification.type === 'billing') return '/billing';
  return '/notifications';
}
