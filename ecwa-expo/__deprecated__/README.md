# __deprecated__ Directory

This directory contains unused files that have been moved from the active codebase for safety.

## Contents

### App Routes (Unused)
- `app-modal.tsx` - Default Expo template modal (not registered in _layout.tsx)
- `app-Bible.tsx` - Placeholder component (not registered in _layout.tsx)

### Utilities (Unused)
- `lib-utils.ts` - Tailwind CSS utility function (not used in mobile app)

### Components (Unused)
- `components/external-link.tsx` - External link wrapper
- `components/haptic-tab.tsx` - Haptic feedback component
- `components/hello-wave.tsx` - Default Expo template component
- `components/parallax-scroll-view.tsx` - Parallax scroll component

### Configuration (Duplicate)
- `eslint.config.mjs.duplicate` - Duplicate ESLint config (duplicate of eslint.config.js)
- `eslintrc-old.js` - Legacy ESLint config format

### Documentation
- `AUDIT_REPORT.md` - Initial audit report
- `CLEANUP_SUMMARY.md` - Cleanup summary
- `FINAL_AUDIT_REPORT.md` - Final comprehensive audit report

## Important Notes

**Themed Components Were Restored:**
- `components/themed-text.tsx` - RESTORED (required by `components/ui/collapsible.tsx`)
- `components/themed-view.tsx` - RESTORED (required by `components/ui/collapsible.tsx`)

These files were initially moved but then restored because they are actively used by `components/ui/collapsible.tsx`, which is used in the application.

## Safe to Delete

After reviewing and confirming these files are unused, they can be safely deleted from this directory.

## Verification

All files in this directory:
- ✅ Were not imported anywhere in the active codebase
- ✅ Moving them caused no breaking changes
- ✅ TypeScript compilation passes without them
