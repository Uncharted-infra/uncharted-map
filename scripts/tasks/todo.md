# Optimization Task – Complete

## Summary

Optimized and shortened the uncharted-map codebase while preserving all features, UI, logic, and functionality.

## Changes Made

| Change | Impact |
|--------|--------|
| **Removed unused `sidebar.tsx`** | -772 lines (shadcn sidebar unused; app uses `sidebar-context` + `app-sidebar`) |
| **Removed duplicate `passport.svg`** | Deleted `public/img/passport.svg` and `src/img/passport.svg` (both unused; PassportIcon uses inline SVG) |
| **Moved `PERSONALITY_OPTIONS` to `data/settings.ts`** | -25 lines in `settings-modal.tsx`; centralized config |
| **Refactored `app-sidebar` nav** | Replaced 4 repeated nav items with `NAV_ITEMS` map; ~40 lines saved |
| **Consolidated `chat-input` mode config** | Merged `MODE_LABELS` + `MODE_SUBMIT_ICONS` into `MODE_CONFIG`; ~15 lines saved |
| **Simplified `explore-globe` color logic** | Replaced 15-line color block with 4-line suffix-based logic |
| **Hoisted `AGENT_MESSAGE_TEXT` in `conversation-panel`** | Moved constant to module scope; minor cleanup |

## Verification

- Build: `pnpm run build` succeeds
- No behavior changes; feature parity preserved

## Files Modified

- `src/components/map/app-sidebar.tsx`
- `src/components/map/chat-input.tsx`
- `src/components/map/conversation-panel.tsx`
- `src/components/map/explore-globe.tsx`
- `src/components/map/settings-modal.tsx`
- `src/data/settings.ts`

## Files Deleted

- `src/components/ui/sidebar.tsx`
- `public/img/passport.svg`
- `src/img/passport.svg`
