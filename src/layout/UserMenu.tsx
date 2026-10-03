import * as Popover from '@radix-ui/react-popover'
import { useNavigate } from 'react-router-dom'
import { LogOut, Settings, User } from 'lucide-react'
import { signOut } from '@/app/auth'
import { ROUTES } from '@/app/routes'
import { useAppData } from '@/data/app-data-context'

function initialsOf(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

/** Header profile menu: identity, Profile / Settings links, and sign out. */
export function UserMenu() {
  const navigate = useNavigate()
  const { settings } = useAppData()
  const { firstName, lastName, role, email } = settings.profile
  const name = `${firstName} ${lastName}`

  const go = (to: string) => {
    void navigate(to)
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          aria-label={`Account: ${name}`}
          className="hover:bg-accent grid size-11 place-items-center rounded-lg"
          type="button"
        >
          <span aria-hidden="true" className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-full text-xs font-semibold">
            {initialsOf(firstName, lastName)}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" aria-label="Account" className="theme-popover w-60" sideOffset={8}>
          <div className="px-2 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="text-muted-foreground text-xs">{role}</p>
            <p className="text-muted-foreground truncate text-xs">{email}</p>
          </div>
          <hr className="border-border my-2" />
          <button
            className="hover:bg-accent flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-sm font-medium"
            onClick={() => {
              go(`${ROUTES.settings}?section=profile`)
            }}
            type="button"
          >
            <User aria-hidden="true" className="size-4" />
            Profile
          </button>
          <button
            className="hover:bg-accent flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-sm font-medium"
            onClick={() => {
              go(ROUTES.settings)
            }}
            type="button"
          >
            <Settings aria-hidden="true" className="size-4" />
            Settings
          </button>
          <hr className="border-border my-2" />
          <button
            className="hover:bg-accent flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-sm font-medium"
            onClick={() => {
              signOut()
              void navigate(ROUTES.login, { replace: true })
            }}
            type="button"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Sign out
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
