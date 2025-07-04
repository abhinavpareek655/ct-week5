# Lyrics - Next-Generation Music Streaming

> **For full setup, database, and feature documentation, see the [docs/](./docs/) folder:**
> - [Supabase Setup Guide](./docs/supabase-setup-guide.md)
> - [Database Schema & Security](./docs/database-schema.md)
> - [Music Player Features](./docs/music-player-features.md)

## Overview

**Lyrics** is a modern, visually immersive music streaming web application built with Next.js, React, and Tailwind CSS. The project aims to deliver a next-generation listening experience, featuring synchronized lyrics, personalized recommendations, trending charts, and a sleek, responsive UI. The app is designed to be both a showcase of UI/UX best practices and a foundation for a full-featured music streaming platform.

---

## Features

### Currently Working

- **Home Dashboard**:  
  - Hero section with project highlights and call-to-action.
  - Featured Playlists: Curated playlists with cover art and descriptions.
  - Trending Now: List of currently popular songs.
  - Recently Played: Carousel of recently played tracks.
  - Recommended Artists: Suggestions based on user taste.
  - Global Charts: Top songs by country.

- **Lyrics Page**:  
  - Synchronized lyrics display for a selected song.
  - Song details (title, artist, album, cover art).
  - Song analysis (BPM, key, energy, danceability).
  - Basic playback controls (play/pause, progress, etc.).

- **Search Page**:  
  - Search for songs, artists, and albums.
  - Tabbed results for each category.
  - Display of top results with cover art and metadata.

- **Music Player**:  
  - Persistent player UI with playback controls.
  - Song info, progress bar, volume, and favorite button.

- **UI/UX**:  
  - Responsive design for desktop and mobile.
  - Modern gradients, glassmorphism, and smooth animations.
  - Accessible components using Radix UI primitives.

---

## Hardcoded Elements & Placeholder Data

> **Note:** The current version is a UI prototype. All music data is hardcoded and uses placeholder images.

- **Songs, Playlists, Artists, Albums, Charts**:  
  All lists and details (titles, artists, covers, etc.) are static arrays in component files (e.g., `featured-playlists.tsx`, `recently-played.tsx`, `global-charts.tsx`, `recommended-artists.tsx`, `trending-now.tsx`, `music-player.tsx`, `lyrics/page.tsx`, `search/page.tsx`).
- **Images**:  
  All cover art and artist images use `/placeholder.svg` or similar placeholder assets.
- **No Real Backend/API**:  
  There is no real authentication, user data, or music streaming backend. All interactivity is local and for demonstration only.

---

## Incomplete or Planned Features

The following features are **not yet implemented** but are logical next steps for future development:

- **Real Data Integration**:  
  - Connect to a real music API for dynamic content.
  - Implement user authentication and personalized data.
- **Full Playback Functionality**:  
  - Stream real audio tracks.
  - Advanced player features (queue, shuffle, repeat, etc.).
- **User Library**:  
  - Save favorite songs, playlists, and artists.
  - User-created playlists and history.
- **Lyrics Sync**:  
  - Real-time, accurate lyric synchronization with music playback.
- **Social Features**:  
  - User profiles, sharing, and following.
- **Settings & Themes**:  
  - User preferences, dark/light mode toggling.
- **Accessibility Improvements**:  
  - Enhanced keyboard navigation and ARIA support.
- **Testing & CI**:  
  - Automated tests and continuous integration setup.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation

```bash
pnpm install
# or
npm install
# or
yarn install
```

### Development

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## Contributing

Contributions are welcome!  
If you'd like to help, consider:

- Refactoring components for reusability.
- Replacing hardcoded data with API calls.
- Improving accessibility and responsiveness.
- Adding new features or fixing bugs.

Please open an issue or pull request to discuss your ideas.

---

## Project Structure

- `app/` - Next.js app directory (pages, layouts, routes)
- `components/` - UI and feature components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions
- `public/` - Static assets (images, placeholders)
- `styles/` - Global and Tailwind CSS files

---

## License

This project is for educational and demonstration purposes.

---

**Enjoy building the future of music streaming!**
