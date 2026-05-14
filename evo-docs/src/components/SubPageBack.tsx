import { useNavigate } from 'react-router-dom'

/**
 * Back-to-parent link shown at the top of any docs sub-page (e.g. the
 * Rich Text Area · API Reference page). Sub-pages are intentionally
 * hidden from the sidebar so the "one row = one component" rhythm
 * stays clean — this link is the bridge for users who land on a
 * sub-page directly via URL.
 */
export function SubPageBack({ to, label }: { to: string; label: string }) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      className="docs-subpage-back"
      onClick={() => navigate(to)}
    >
      {label}
    </button>
  )
}
