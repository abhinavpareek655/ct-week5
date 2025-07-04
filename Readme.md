# Lyrics - Next-Generation Music Streaming

> **For full setup, database, and feature documentation, see the [docs/](./docs/) folder:**
> - [Supabase Setup Guide](./docs/supabase-setup-guide.md)
> - [Database Schema & Security](./docs/database-schema.md)
> - [Music Player Features](./docs/music-player-features.md)

## Overview

**Lyrics** is a modern, visually immersive music streaming web application built with Next.js, React, Tailwind CSS, and Supabase. The project delivers a next-generation listening experience, featuring synchronized lyrics, personalized recommendations, trending charts, playlists, liked songs, and a sleek, responsive UI. The app is designed to be both a showcase of UI/UX best practices and a foundation for a full-featured music streaming platform.

---

## Features

- **Home Dashboard**:  
  - Hero section with project highlights and call-to-action.
  - Featured Playlists: Curated playlists with cover art and descriptions.
  - Trending Now: List of currently popular songs.
  - Recently Played: Carousel of recently played tracks (per user).
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
  - Like/unlike songs (persisted to Supabase).
  - Add songs to playlists.

- **Playlists**:  
  - Create, view, and manage personal playlists.
  - Add/remove songs from playlists.
  - Public playlists: Browse and play community playlists.
  - Sidebar access to liked songs and playlists.

- **Recently Played & Play History**:  
  - Tracks and displays user's recently played songs.

- **Authentication**:  
  - Supabase Auth for user sign-up, login, and session management.

- **UI/UX**:  
  - Responsive design for desktop and mobile.
  - Modern gradients, glassmorphism, and smooth animations.
  - Accessible components using Radix UI primitives.

---

## Data & Backend

- **Supabase** is used for:
  - Database (PostgreSQL)
  - Authentication (users, sessions)
  - Row Level Security (RLS) for user data privacy
  - Real-time updates (where applicable)
- **All music data, playlists, likes, and play history are persisted in the database.**

---

## Incomplete or Planned Features

The following features are **not yet implemented** but are logical next steps for future development:

- **Real Audio Streaming**:  
  - Stream real audio tracks (currently uses demo/sample audio).
- **Advanced Playback**:  
  - Queue, shuffle, repeat, crossfade, and gapless playback.
- **User Library Enhancements**:  
  - Download songs for offline listening.
  - Song/album/artist following and notifications.
- **Social Features**:  
  - User profiles, sharing, following, and collaborative playlists.
- **Settings & Themes**:  
  - User preferences, dark/light mode toggling.
- **Accessibility Improvements**:  
  - Enhanced keyboard navigation and ARIA support.
- **Testing & CI**:  
  - Automated tests and continuous integration setup.

---

## Documentation

- **Database schema, API endpoints, and feature documentation are available in the [docs/](./docs/) folder.**

---

## License

This project is for educational and demonstration purposes.

---

**Enjoy building the future of music streaming!**
