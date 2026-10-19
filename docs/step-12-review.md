# Step 12 — vocabulary, culture, GameCards and games

Learners now have Vocabulary, Culture, GameCards and Games under Discover, with distinct sidebar icons. Content staff have Card QR codes under Publishing.

Implemented documented flows:

- Vocabulary pagination and language selection, word details, pronunciation text/example sentences when present, and cross-language concept comparison. No pronunciation audio is fabricated.
- Cultural topic catalog, text reader and explicit backend-confirmed completion. Unknown blocks are visible as unavailable and prevent completion. No local reward credit.
- Game catalog/details with premium labels. Launch is unavailable pending a real handoff contract; no score/session reward is manufactured.
- Manual GameCard code or ATUPA scan-link entry, card words, translations, lesson links, explicit Record this scan, challenge answers and server-returned correctness/reward feedback. Read-only card responses are allowlisted before browser delivery.
- Play history, refresh/pagination and no automatic retry after ambiguous reward mutations. Failed mutation controls stop and direct the learner to inspect saved history/progress.
- Optional native QR camera scanning with secure-context/support checks, permission errors and manual fallback. Camera stops on close/unmount/error/success; unsupported BarcodeDetector browsers use manual entry. No additional scanner package was installed.
- Public /scan/:code preserves a safe dashboard return path through sign-in. Only a code or exact same-origin /scan/:code is accepted; unrelated QR URLs are rejected.
- Staff printable QR retrieval, complete-image validation and exact current-origin scan link check. The supplied example is truncated and uses localhost; mismatched production QR remains blocked with a configuration message.

## Brief test checklist

1. With a learner account, open Vocabulary, change language, open a word and compare its concept across languages. Check Culture reading, Complete topic and refreshed Progress.
2. Open GameCards with a real existing code. Confirm opening alone does not record a scan. Record the scan, answer a challenge and check returned feedback plus refreshed play history. Invalid codes/foreign links should show a useful error.
3. On a supported phone/browser, start the camera explicitly, allow/deny permission, scan an ATUPA card and stop/leave the page. Manual entry should remain usable. Physical camera operation is not verified locally.
4. Check Games details and mobile layout. Launch and audio are pending rather than simulated. As teacher/content creator/super admin, open Card QR codes and retrieve a real existing code; verify deployed origin and a complete QR before printing.

## Verification

Production build/TypeScript, targeted ESLint and 40 unit/contract tests passed. Four frontend HTTP lifecycle scenarios passed against collection-derived local fixtures: discovery reads/pagination, read-only card projection/role denial, modeled reward responses/deduplication/history, cultural completion and staff QR retrieval. Actual simulation logs showed frontend requests reaching the dependency. These checks establish frontend behavior against stand-ins only. No owning-team published mock was available from earlier workspace discovery; no mocks were published or deployed.

Browser checks used a synthetic local learner: vocabulary list/details, cultural topic completion confirmation, manual GameCard lookup, scan confirmation, correct challenge feedback, refreshed history, foreign-link rejection and game launch-unavailable state. GameCard form/header fit at 375px; viewport restored afterward. Screenshot atupa-step-12-gamecards.png is saved in the task workspace. No live records were changed.

Reproduce with npm run simulate:discovery, npm run build, node scripts/start-session-test.mjs, then npm run test:discovery-http.

## Pending — leave Step 12 unchecked

- Real pronunciation audio contract/assets for vocabulary/cards (US-09).
- Verified GameApp URL/deep link, identity and trustworthy result synchronization; current sessions POST does not establish this.
- Complete QR image response with backend frontend origin configured to the deployed app, then physical printed-card and camera/device/permission testing.
- Live isolated accounts for ownership, entitlement, staff roles, repeated completion/scans/challenges and reward deduplication. Concurrent tabs/devices and ambiguous POST recovery need backend policy confirmation.
- Additional cultural media block contracts if required content uses them.

## Backend clarification draft — not sent

Please provide a vocabulary/GameCard pronunciation audio response with a real playable asset; configured game launch/deep-link and identity/result handoff; a complete QR response whose scanUrl uses the deployed frontend origin; and repeated-scan/challenge/completion reward and idempotency rules, including ambiguous-response recovery. Please confirm staff QR permissions and cultural media block fields.

Step 13 certificate viewing/verification remains unstarted.
