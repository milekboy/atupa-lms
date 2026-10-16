# Step 2 design foundation review

Implemented 2026-10-16. Preview: http://localhost:3000.

## Delivered

- Central light/dark semantic tokens using ATUPA's cream, green, terracotta and mustard palette. Darker terracotta text improves contrast; the original terracotta remains available for decorative branding.
- Georgia serif and Segoe UI/system sans stacks with Unicode fallbacks. No trial fonts or build-time external font downloads.
- All shared components named in Step 2: buttons/icon buttons, inputs/selects/textareas, checkbox/switch, modal/confirmation, dropdown, page header, statistics, table, pagination, search/filter bar, skeleton, empty/error states, status pill and motion section wrapper.
- One Toastify container, React Icons and motion/react; theme preference is the only persisted preview state.
- Reusable number/date/duration formatters and required/email/password/URL/file validators. Password minimum length is caller-supplied so UI utilities do not invent backend policy.
- ATUPA metadata and icon. The homepage temporarily hosts the explicitly labelled component review; real public pages and dashboards remain later steps.

## Verification

- Production build passed, including TypeScript compilation. ESLint passed.
- Browser: desktop 1280px and mobile 320px inspected; 320px document width equalled viewport width with no page overflow in light/dark and form-error states.
- Empty submission showed associated name/email errors. Search for Hausa and filtering to Igbo returned the appropriate sample rows. Pagination reached Hausa on page 2.
- Native modal plus explicit keyboard wrap verified in both directions; Escape closes and restores opener focus; body scrolling locks while open and restores after close.
- Confirmation completed its pending state, closed and showed feedback without changing backend records.
- Light/dark theme switched successfully. Yoruba, Igbo and Hausa diacritics were visually inspected. Full cross-browser/font-platform QA remains part of release checks.
- Reduced motion is supported by useReducedMotion and global CSS; OS-level preference emulation was not available through the review browser, so runtime reduced-motion QA remains a manual check.
- Browser console showed no captured warnings/errors during interaction review.
- Dependency audit reports five high advisories through the pre-existing eslint-config-next > eslint plugin > fast-glob > micromatch > braces chain. None is attributed to the three added runtime UI packages. npm suggests a breaking downgrade to eslint-config-next 14; no forced downgrade was applied. Resolve compatible lint-toolchain updates before release.

## What to test

1. Check colours/type and accented language text; toggle the moon/sun control and refresh to check preference persistence.
2. Submit the empty form, then a valid sample name/email. Verify inline errors and success feedback; data stays local to the preview.
3. Open a dialog. Use Tab/Shift+Tab, Escape, Close and backdrop; check focus returns to the opener. Try the confirmation action too.
4. Try toast buttons, dropdown, checkbox, reminder switch and disabled controls.
5. Search/filter languages, use pagination, and switch Empty/Loading/Error with retry.
6. At a 320px viewport, check readable wrapping and no page overflow. With OS reduced motion enabled, check that movement and loading shimmer stop.

Step 3 was not started. No API credentials, accounts or learner data were introduced.
