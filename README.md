# 📚 InkStream - Manga & Manhwa Reading App

A modern manga and adult Korean manhwa reading application built with React, Vite, and Tailwind CSS. Powered by the MangaDex API with full PWA support and native Android app.

![InkStream](public/InkStream.webp)

## ✨ Features

### 📖 Reading Experience
- 📚 Browse popular manga and manhwa
- 🔍 Real-time search with suggestions
- 📂 Category-based browsing
- 📖 Full-screen reader with keyboard navigation
- 🔄 Auto-scroll to top when changing pages/chapters
- 🔞 Adult Korean manhwa section (18+)

### 📱 Multi-Platform Support
- 🌐 **Web App** - Works in any modern browser
- 📲 **PWA** - Install as app on mobile/desktop
- 🤖 **Android APK** - Native Android app via Capacitor
- 📱 Responsive design for all screen sizes

### 🎨 User Experience
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast performance with Vite
- 🔔 Toast notifications
- 💾 Local storage for preferences
- 🌙 Clean, intuitive interface

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v3.4 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Mobile | Capacitor (Android) |
| API | MangaDex API |

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MineoreYT/InkStream.git
cd manga-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 📱 Mobile App

### PWA Installation
1. Visit the deployed site on your mobile browser
2. Click "Add to Home Screen" or use the install prompt
3. The app will be installed like a native app

### Android APK
The Android APK is automatically built via GitHub Actions when code is pushed to main.

1. Go to the [Actions tab](../../actions) on GitHub
2. Find the latest successful build
3. Download the `InkStream.apk` artifact
4. Install on your Android device

## 🔞 Adult Content (Manhwa 18+)

InkStream includes a dedicated section for adult Korean manhwa with proper safeguards:

### Features
- **Age Verification** - Users must confirm 18+ to access
- **Content Warnings** - Clear warnings about mature content
- **Language Notice** - Some chapters may not be in English
- **Real MangaDex Data** - Fetches actual adult manhwa from MangaDex API

### Content Ratings
| Rating | Badge | Description |
|--------|-------|-------------|
| Safe | - | General audiences |
| Suggestive | S | Mild suggestive themes |
| Erotica | 18+ | Adult content with nudity |
| Pornographic | 🔞 | Explicit adult content |

## 📁 Project Structure

```
manga-app/
├── api/                    # Vercel serverless functions
│   ├── manga.js           # MangaDex API proxy
│   ├── chapter-proxy.js   # Chapter image proxy
│   └── image-proxy.js     # Cover image proxy
├── public/                 # Static assets
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   └── services/          # API services
├── android/               # Capacitor Android project
└── .github/workflows/     # GitHub Actions (APK build)
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run android:sync` | Sync Capacitor with Android |
| `npm run android:build` | Build Android project |

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Vite and deploy
3. Serverless functions in `/api` folder work automatically

### Environment Variables
No environment variables required - the app uses public APIs.

## 🙏 Credits

### API
- **MangaDex** - Manga/Manhwa data and images
- **API Docs**: https://api.mangadex.org/docs/

### Image Proxies
- **corsproxy.io** - CORS proxy for chapter pages
- **images.weserv.nl** - Image proxy fallback

### Technologies
- React Team for the amazing framework
- Tailwind CSS for utility-first styling
- Vite for lightning-fast builds
- Capacitor for native mobile support

## 📄 License

This project is for educational purposes. Please respect MangaDex's terms of service and the rights of manga creators and publishers.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Made with ❤️ by MineoreYT**
