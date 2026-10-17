# Step 5 review — dashboard shell

Implemented 2026-10-17. Step 6 is not started.

## Delivered

- BiblePlus-inspired floating forest-green rail, hover/focus expansion and keyboard-operable pin. The workspace contracts as the sidebar expands and grows as it collapses, including hover, keyboard focus and pinned states. Mobile continues to use a drawer.
- Mobile native-dialog navigation with focus trap, Escape/backdrop close, viewport resize handling, scroll lock and opener focus restoration. Navigation closes the drawer.
- Role-specific introductions and navigation definitions for all six backend roles. Only Overview and My account are enabled until subsequent feature steps implement their destinations.
- Active links use pathname segment boundaries; server layout rechecks the trusted request pathname and authenticated user. Unknown protected sections fail closed in the permission helper. Unimplemented routes return 404.
- Separate workspace page search, including `/` shortcut and profile/password keywords. It cannot surface unfinished or inaccessible destinations.
- Theme control, account dropdown, profile navigation and logout with error/retry handling. Theme is the only persisted UI preference.
- Bell opens recent notifications through the shared authenticated transport, with loading, empty, error/retry and permission states. It does not mark notifications read; full notification management remains Step 18.
- Focused layout rule prepared for lesson and quiz-attempt routes, which are not yet implemented.
- Overview uses real account details and editorial cultural copy. No fabricated metrics or activity.

## Verification

- `npm run test:contracts`: 14 passed, including all six roles, hidden destinations, active matching and denied cross-role sections.
- `node --test tests/dashboard-http.mjs`: passed against the existing local Postman simulation. Loops over all six synthetic roles, verifies overview/profile rendering, notification empty envelope and 404 for unimplemented user management. This does not prove live backend ownership policies.
- `npm run lint` and `npm run build`: passed; build includes TypeScript.
- Browser: desktop rail pin/unpin, 76px compact width, page-search results and empty state, notification empty state, light/dark themes, profile navigation and logout. At 320px: no page overflow, mobile drawer fits, reverse-Tab wraps, Escape restores the menu trigger, selecting profile closes the drawer. Synthetic fixture accounts only.
- Fixed collapsed-navigation horizontal scrollbar and cramped 320px account control found during review.

## Review checklist

1. Sign in and check the role label and welcome screen.
2. Hover/focus the sidebar, pin/unpin it, then open My account and check the active icon.
3. Search for “password” and follow My account; search for an unknown page and check the empty state.
4. Switch themes and reload; open notifications and the account dropdown.
5. On mobile, open the menu, try Escape/backdrop and select My account. Check that content stays within the screen.
6. Log out and confirm protected pages require sign-in.

Live six-role staging access, production Redis and real reset/invitation emails remain previously documented release checks. No real account credentials were used for this step. The normal development server uses the configured real backend after testing; simulation is opt-in only.

## Sidebar review correction (2026-10-17)

Compared BiblePlus DashboardShell directly. Pointer focus no longer keeps the sidebar expanded after unpinning, and navigation no longer clears hover while the pointer remains within the sidebar. Sidebar width and workspace padding use matching 300ms ease-out transitions. Browser checks with a synthetic learner confirmed compact sidebar 76px/workspace left 112px and expanded sidebar 260px/workspace left 296px at 1280px, with no horizontal page overflow. Pinned state retains the contracted workspace after moving to page search.
