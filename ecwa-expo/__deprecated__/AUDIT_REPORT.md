# Codebase Audit Report
Generated: $(Get-Date)

## Summary
This audit identifies unused, duplicate, and orphaned files in the ECWA Media Center mobile app codebase.

---

## Files Safe to Remove (Unused/Orphaned)

### 1. Unused Route Files in `app/`
- **`app/modal.tsx`** - Default Expo template modal, not registered in `_layout.tsx`
- **`app/Bible.tsx`** - Placeholder component, not registered in `_layout.tsx`

### 2. Unused Utility Files
- **`lib/utils.ts`** - Contains `cn()` function for Tailwind CSS merging, not imported anywhere (mobile app doesn't use Tailwind)

### 3. Unused Components
- **`components/hello-wave.tsx`** - Default Expo template component, not used
- **`components/haptic-tab.tsx`** - Haptic feedback component, not imported anywhere
- **`components/external-link.tsx`** - External link wrapper, not imported anywhere
- **`components/parallax-scroll-view.tsx`** - Parallax scroll component, not imported anywhere

### 4. Unused Themed Components (Only used by unused files)
- **`components/themed-text.tsx`** - Only used by `modal.tsx` and `parallax-scroll-view.tsx` (both unused)
- **`components/themed-view.tsx`** - Only used by `modal.tsx` and `parallax-scroll-view.tsx` (both unused)

**Note:** These themed components are standard Expo template components, but they're not used by the actual application code. The app uses custom styling with `StyleSheet` and `Palette` from `constants/theme.ts`.

### 5. Duplicate Configuration Files
- **`.eslintrc.js`** - Legacy ESLint config (duplicate of `eslint.config.js` and `eslint.config.mjs`). The flat config (`eslint.config.js`) is the active one.

### 6. Template Scripts (Optional - Keep if needed for project reset)
- **`scripts/reset-project.js`** - Default Expo template script for resetting project. Keep if you want the ability to reset, otherwise safe to remove.

---

## Files to Move to `__deprecated__` (Uncertain/Reference)

### Documentation Files (Keep for Reference - Consider Consolidation)
- **`API_DISABLED.md`** - Documentation about API status
- **`BACKEND_REMOVED.md`** - Documentation about backend changes
- **`CLEAR_CACHE.md`** - Cache clearing instructions
- **`FIX_BACKEND.md`** - Backend fix instructions
- **`IP_SETUP.md`** - IP setup documentation
- **`MOBILE_API_SETUP.md`** - API setup documentation
- **`NETWORK_CHECKLIST.md`** - Network troubleshooting checklist
- **`TROUBLESHOOTING.md`** - General troubleshooting guide

**Recommendation:** Consolidate these into a single `docs/` directory or merge into `README.md`.

### Utility Scripts (Keep - Used for Development)
- **`clear-cache.ps1`** - Cache clearing script (referenced in docs)
- **`RESTART_BACKEND.ps1`** - Backend restart script (referenced in docs)

---

## Old Web App Structure (Separate Project)

### Entire Directory: `ecwa-divine-path/src/`
This appears to be a **separate web application** (Vite + React + Tailwind CSS) that is not used by the mobile app (`ecwa-expo`). The mobile app uses `ecwa-expo/src/`.

**Files include:**
- Web app pages (`src/pages/*.tsx`)
- Web app components (`src/components/*.tsx`)
- Web app API (`src/lib/api.ts`)
- Web app utilities (`src/lib/utils.ts` with Tailwind `cn()`)
- Web app contexts (`src/contexts/AuthContext.tsx`)
- Vite config files
- Tailwind config

**Decision Required:** 
- If this web app is still active/needed → Keep in separate location
- If this web app is deprecated → Move to `__deprecated__` or separate repo

---

## Files Confirmed as ACTIVE (Do Not Remove)

### Active App Routes (`app/`)
All files in `app/` directory except `modal.tsx` and `Bible.tsx` are active and used.

### Active Components (`components/ui/`)
- `components/ui/collapsible.tsx` - ✅ Used
- `components/ui/icon-symbol.tsx` - ✅ Used
- `components/ui/icon-symbol.ios.tsx` - ✅ Used (iOS variant)

### Active Source Files (`src/`)
- `src/pages/*.tsx` - All page components are actively used by app routes
- `src/lib/api.ts` - Core API service
- `src/lib/auth-flow-state.tsx` - Authentication state management
- `src/lib/html-renderer.tsx` - HTML rendering utility
- `src/lib/hymn-format.ts` - Hymn formatting utility

### Active Configuration
- `eslint.config.js` - ✅ Active ESLint config (flat config)
- `eslint.config.mjs` - ✅ Alternative ESLint config
- `.eslintrc.js` - ❌ Duplicate (remove this one)

---

## Recommended Actions

1. **Immediate Removal (Safe)**
   - Remove unused route files: `app/modal.tsx`, `app/Bible.tsx`
   - Remove unused utilities: `lib/utils.ts`
   - Remove unused components: `hello-wave.tsx`, `haptic-tab.tsx`, `external-link.tsx`, `parallax-scroll-view.tsx`
   - Remove duplicate config: `.eslintrc.js`

2. **Move to Deprecated (If Not Used)**
   - Move themed components if confirmed unused: `components/themed-text.tsx`, `components/themed-view.tsx`

3. **Organize Documentation**
   - Create `docs/` directory
   - Consolidate `.md` files or move to `docs/`

4. **Decision Needed**
   - Determine status of `ecwa-divine-path/src/` (web app structure)

---

## Clean Structure Proposal

```
ecwa-expo/
├── app/                          # Expo Router routes (active)
│   ├── (tabs)/                  # Tab navigation routes
│   └── *.tsx                    # Stack routes
├── src/
│   ├── pages/                   # Page components (active)
│   ├── lib/                     # Core utilities (active)
│   └── assets/                  # Images and assets
├── components/
│   └── ui/                      # UI components (active)
├── constants/
│   └── theme.ts                 # Theme configuration
├── hooks/                       # Custom hooks
├── scripts/                     # Build/utility scripts
├── docs/                        # Documentation (new)
│   └── *.md                     # Consolidated docs
├── __deprecated__/              # Unused files (archive)
└── [config files]               # package.json, tsconfig.json, etc.
```
