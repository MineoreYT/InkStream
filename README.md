# InkStream - Manga Reading App

A modern manga reading application built with React, Vite, and Tailwind CSS, powered by the MangaDex API.

## Features

- 📚 Browse popular and latest manga
- 🔍 Search functionality with real-time suggestions
- 📂 Category-based browsing
- 📖 Full-screen manga reader with keyboard navigation
- 🔞 NSFW content toggle with age verification
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast performance with Vite
- 🔔 Toast notifications for user feedback
- 💾 Local storage for user preferences

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Styling**: Tailwind CSS v3.4
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **API**: MangaDex API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd manga-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## NSFW Content

InkStream includes mature content features with proper safeguards:

### Features
- **Age Verification**: Users must confirm they are 18+ to access NSFW content
- **Content Toggle**: NSFW content can be enabled/disabled in the sidebar
- **Content Ratings**: Visual badges indicate content ratings (Safe, Suggestive, Erotica, Pornographic)
- **Dedicated Section**: Separate NSFW page with additional warnings
- **User Preferences**: Settings are saved locally for convenience

### Content Ratings
- **Safe**: General audiences, no mature content
- **Suggestive**: Mild suggestive themes, marked with "S" badge
- **Erotica**: Adult content with nudity, marked with "18+" badge  
- **Pornographic**: Explicit adult content, marked with "🔞" badge

### Privacy & Safety
- Age verification is required before accessing any NSFW content
- Content warnings are displayed when NSFW is enabled
- All preferences are stored locally on your device
- No personal data is sent to external servers

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # App header with search
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── MangaCard.jsx   # Manga display card
│   └── LoadingSpinner.jsx
├── pages/              # Page components
│   ├── HomePage.jsx    # Main landing page
│   ├── MangaDetail.jsx # Manga details page
│   ├── MangaReader.jsx # Manga reading interface
│   └── CategoryPage.jsx # Category browsing
├── services/           # API services
│   └── mangadexApi.js  # MangaDex API integration
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## API Credits

This application uses the **MangaDex API** to fetch manga data.

- **API Provider**: MangaDex
- **Website**: https://mangadex.org
- **API Documentation**: https://api.mangadx.org/docs/

### MangaDex API Features Used:
- Manga search and browsing
- Chapter listings
- Cover art retrieval
- Category/tag filtering
- Chapter page images

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Home Page
- Popular manga carousel
- Latest updates section
- Quick navigation to categories

### Manga Details
- Comprehensive manga information
- Chapter listings
- Author and artist details
- Tags and categories
- Reading progress tracking

### Manga Reader
- Full-screen reading experience
- Keyboard navigation (arrow keys)
- Page indicators
- Chapter navigation

### Sidebar Navigation
- Category browsing
- Quick access to favorites
- API credits section

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational purposes. Please respect MangaDex's terms of service and the rights of manga creators and publishers.

## Acknowledgments

- **MangaDex** for providing the comprehensive manga API
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the lightning-fast build tool