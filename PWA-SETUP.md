# InkStream PWA Setup

## What is a PWA?
A Progressive Web App (PWA) allows users to install your web app on their mobile devices like a native app. Users can:
- Install from browser (Add to Home Screen)
- Use offline (with service worker caching)
- Get app-like experience (fullscreen, splash screen)
- Receive push notifications (future feature)

## Current Setup ✅

### 1. Manifest File (`public/manifest.json`)
- App name, description, icons
- Display mode: standalone (fullscreen app)
- Theme colors and orientation
- Shortcuts for quick access

### 2. Service Worker (`public/sw.js`)
- Caches app files for offline use
- Handles network requests
- Updates cache when app changes

### 3. PWA Meta Tags (`index.html`)
- Apple mobile web app support
- Theme colors and status bar
- App icons for different devices

### 4. Install Prompt (`src/components/InstallPrompt.jsx`)
- Shows install banner to users
- Handles install process
- Remembers user preferences

## How Users Install 📱

### Android (Chrome/Edge):
1. Visit your app in browser
2. See "Install InkStream" prompt OR
3. Menu → "Add to Home Screen" OR
4. Address bar → Install icon

### iOS (Safari):
1. Visit your app in Safari
2. Share button → "Add to Home Screen"
3. Confirm installation

### Desktop (Chrome/Edge):
1. Visit your app
2. Address bar → Install icon
3. Or Chrome menu → "Install InkStream"

## Next Steps 🚀

### 1. Create Real Icons
Replace placeholder icons in `public/icons/` with actual PNG files:
- Use your app logo/design
- Sizes: 72, 96, 128, 144, 152, 192, 384, 512px
- Tools: Figma, Photoshop, or online generators

### 2. Add Screenshots
Add app screenshots to `public/screenshots/`:
- `mobile-1.png` (390x844px) - Mobile screenshot
- `desktop-1.png` (1920x1080px) - Desktop screenshot

### 3. Test Installation
- Test on different devices/browsers
- Check offline functionality
- Verify app appears in app drawer

### 4. Optional Enhancements
- Push notifications
- Background sync
- Advanced caching strategies
- App shortcuts

## Alternative: Capacitor (Native App)

If you want a real native app (APK/IPA), you can use Capacitor:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init InkStream com.yourname.inkstream
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
npm run build
npx cap sync
npx cap open android  # Opens Android Studio
```

This creates actual native apps that can be published to app stores.

## Current Status
✅ PWA setup complete
✅ Install prompt added
⏳ Need real icons (currently using placeholders)
⏳ Need screenshots for app stores
⏳ Test on various devices

Your InkStream app is now installable as a PWA! 🎉