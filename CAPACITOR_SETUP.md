# ECWA Divine Path - Capacitor Setup Guide

This mobile app is built with React + Capacitor for native iOS and Android deployment.

## Design System

**Brand Colors:**
- Primary (ECWA Blue): #0A3A8A
- Accent (Gold): #F2C94C
- Background: #FFFFFF
- Text: #0F1724

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Git
- **For iOS**: Mac with Xcode installed
- **For Android**: Android Studio installed

### Initial Setup

1. **Export project to GitHub**
   - Click "Export to GitHub" button in Lovable
   - Clone your repository locally

2. **Install dependencies**
   ```bash
   git clone <your-repo-url>
   cd ecwa-divine-path
   npm install
   ```

3. **Add native platforms**
   ```bash
   npx cap add ios
   npx cap add android
   ```

4. **Update native dependencies**
   ```bash
   npx cap update ios
   npx cap update android
   ```

5. **Build the web app**
   ```bash
   npm run build
   ```

6. **Sync with native platforms**
   ```bash
   npx cap sync
   ```

### Running on Device/Emulator

**iOS (Mac only):**
```bash
npx cap run ios
```

**Android:**
```bash
npx cap run android
```

### Development Workflow

The app is configured for hot-reload from the Lovable sandbox during development:
- URL: `https://b506060a-c8cd-45dd-8934-d0e7af5f74a8.lovableproject.com`
- This allows you to see changes in real-time on your device

**For production:**
1. Update `capacitor.config.ts` - remove the `server` configuration
2. Build: `npm run build`
3. Sync: `npx cap sync`
4. Run on device

### API Integration

Replace placeholder endpoints in the code with your actual backend:

**Base URL:** `https://api.example.com/v1`

**Endpoints to implement:**
- `POST /auth/send-token` - Send email login token
- `POST /auth/verify-token` - Verify token and return JWT
- `GET /auth/status` - Check token validity
- `GET /hymns?lang=en|yo` - Get hymns list
- `GET /hymns/:id` - Get single hymn
- `GET /manuals?lang=en|yo` - Get manuals list
- `GET /manuals/:id` - Get single manual (gated)
- `POST /payments/create-session` - Initialize payment
- `GET /payments/verify` - Verify payment

Search for `TODO:` comments in the code for exact integration points.

### Payment Integration

The app has a placeholder for Paystack integration in `src/pages/Payment.tsx`.

To integrate:
1. Sign up for Paystack
2. Add your public key to the payment component
3. Implement the payment flow with Paystack SDK

### Assets

Logo is located at: `src/assets/ecwa-logo.png`

For splash screens and app icons, generate assets and place them in:
- iOS: `ios/App/App/Assets.xcassets/`
- Android: `android/app/src/main/res/`

### Features Implemented

✅ Email token authentication
✅ Persistent login (localStorage)
✅ Hymns library (English/Yoruba)
✅ Hymn detail with adjustable font size
✅ Bookmark functionality
✅ Sunday School manuals (payment gated)
✅ Payment flow (Paystack ready)
✅ User profile & settings
✅ Mobile-first responsive design
✅ ECWA brand colors & styling

### Next Steps

1. Connect to your backend API
2. Implement offline caching
3. Add actual audio files for hymns
4. Integrate real payment gateway
5. Generate app icons and splash screens
6. Test on physical devices
7. Prepare for App Store/Play Store submission

### Support

For Capacitor documentation: https://capacitorjs.com/docs
For Lovable support: https://docs.lovable.dev/

---

Built with ❤️ for ECWA
