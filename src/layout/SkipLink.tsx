/**
 * Skip-to-content link for keyboard users.
 * Visually hidden until focused; jumps to #main-content.
 */
export function SkipLink() {
  return (
    <a
      className="bg-card text-foreground sr-only z-[60] rounded-lg px-4 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      href="#main-content"
    >
      Skip to content
    </a>
  )
}
