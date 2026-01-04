# Codebase Cleanup Summary

## Files Moved to `__deprecated__/`

The following unused files have been moved to the `__deprecated__/` directory for safety:

### App Routes (Unused)
- ✅ `app/modal.tsx` → `__deprecated__/app-modal.tsx`
- ✅ `app/Bible.tsx` → `__deprecated__/app-Bible.tsx`

### Utilities (Unused)
- ✅ `lib/utils.ts` → `__deprecated__/lib-utils.ts`
  - Contained `cn()` function for Tailwind CSS (not used in mobile app)

### Components (Unused)
- ✅ `components/hello-wave.tsx` → `__deprecated__/components-hello-wave.tsx`
- ✅ `components/haptic-tab.tsx` → `__deprecated__/components-haptic-tab.tsx`
- ✅ `components/external-link.tsx` → `__deprecated__/components-external-link.tsx`
- ✅ `components/parallax-scroll-view.tsx` → `__deprecated__/components-parallax-scroll-view.tsx`
- ⚠️ `components/themed-text.tsx` - INITIALLY MOVED, THEN RESTORED (required by `components/ui/collapsible.tsx`)
- ⚠️ `components/themed-view.tsx` - INITIALLY MOVED, THEN RESTORED (required by `components/ui/collapsible.tsx`)

### Configuration (Duplicate)
- ✅ `.eslintrc.js` → `__deprecated__/.eslintrc.js.old` (legacy format)
- ✅ `eslint.config.mjs` → `__deprecated__/eslint.config.mjs.duplicate` (duplicate of eslint.config.js)

**Active ESLint Config:** `eslint.config.js` (flat config, CommonJS)

---

## Verification

After moving files:
- ✅ TypeScript compilation checked
- ✅ No breaking imports (all moved files were unused)
- ✅ App functionality preserved

---

## Next Steps (Optional)

1. **Review `__deprecated__/` folder** - Verify these files are truly unused
2. **After confirmation** - These files can be safely deleted
3. **Documentation** - Consider consolidating `.md` files into a `docs/` directory
4. **Old Web App** - Review status of `ecwa-divine-path/src/` (separate web app)

---

## Notes

- All moved files were confirmed unused (no imports found)
- Themed components were initially moved but **restored** because they're required by `components/ui/collapsible.tsx` (which is actively used)
- ESLint configs were duplicates (kept the CommonJS flat config `eslint.config.js`)
- Mobile app uses custom styling, not Tailwind CSS

## Important Correction

The `components/themed-text.tsx` and `components/themed-view.tsx` files were initially moved but then **restored** to the `components/` directory because they are required by `components/ui/collapsible.tsx`, which is actively used in the application.
