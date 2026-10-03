import * as Popover from '@radix-ui/react-popover'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { ROUTES } from '@/app/routes'
import { useAppActions, useAppData } from '@/data/app-data-context'
import { NOTIFICATION_TYPE_META, notificationTarget } from '@/domain/notifications'
import type { AppNotification } from '@/domain/models'

const RECENT_LIMIT = 10

/**
 * Header notifications: unread count on the bell, the 10 most recent
 * notifications, mark one / all as read, and open the related order.
 */
export function NotificationsMenu() {
  const navigate = useNavigate()
  const { notifications } = useAppData()
  const { markNotificationRead, markAllNotificationsRead } = useAppActions()
  const unread = notifications.filter((row) => !row.read).length
  const recent = notifications.slice(0, RECENT_LIMIT)

  const open = (notification: AppNotification) => {
    markNotificationRead(notification.id)
    void navigate(notificationTarget(notification))
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          aria-label={`Notifications, ${String(unread)} unread`}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground relative grid size-11 place-items-center rounded-lg"
          type="button"
        >
          <Bell aria-hidden="true" className="size-5" />
          {unread > 0 && (
            <span aria-hidden="true" className="bg-destructive absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full font-mono text-[11px] font-semibold text-white">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          aria-label="Notifications"
          className="theme-popover w-[380px] max-w-[calc(100vw-2rem)]"
          sideOffset={8}
        >
          <div className="flex items-center justify-between gap-3 px-1 py-1">
            <div>
              <h2 className="text-section font-semibold">Notifications</h2>
              <p className="text-muted-foreground text-xs">
                {unread > 0 ? `${String(unread)} unread` : 'All caught up'}
              </p>
            </div>
            <button
              className="text-primary hover:bg-primary-tint disabled:text-muted-foreground min-h-11 rounded-lg px-3 text-sm font-semibold disabled:cursor-not-allowed"
              disabled={unread === 0}
              onClick={markAllNotificationsRead}
              type="button"
            >
              Mark all read
            </button>
          </div>
          <hr className="border-border my-2" />
          {recent.length === 0 ? (
            <p className="text-muted-foreground px-1 py-6 text-center text-sm">No notifications yet.</p>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto">
              {recent.map((notification) => {
                const meta = NOTIFICATION_TYPE_META[notification.type]
                return (
                  <li key={notification.id}>
                    <button
                      className="hover:bg-accent flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left"
                      onClick={() => {
                        open(notification)
                      }}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className={notification.read ? 'bg-muted mt-1.5 size-2 shrink-0 rounded-full' : 'bg-primary mt-1.5 size-2 shrink-0 rounded-full'}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold">{notification.title}</span>
                          <span className="bg-muted text-muted-foreground shrink-0 rounded-full px-2 py-0.5 text-xs">
                            {meta.label}
                          </span>
                        </span>
                        <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-xs leading-5">
                          {notification.message}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          <hr className="border-border my-2" />
          <button
            className="hover:bg-accent min-h-11 w-full rounded-lg px-3 text-sm font-semibold"
            onClick={() => {
              void navigate(ROUTES.notifications)
            }}
            type="button"
          >
            View all notifications
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
