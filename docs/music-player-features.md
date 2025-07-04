# Music Player Features

## New Features Implemented

### 1. Like/Unlike Songs ❤️
- **Functionality**: Users can like or unlike songs with visual feedback
- **Visual Indicator**: Heart icon turns red when liked, gray when not liked
- **Persistence**: Liked status is stored in the database and persists across sessions
- **Authentication**: Requires user to be logged in

### 2. Add Songs to Albums 📁
- **Functionality**: Users can add currently playing song to any existing album
- **Interface**: Dialog with dropdown to select available albums
- **API Integration**: Updates song's album_id in the database
- **Feedback**: Toast notification confirms successful addition

### 3. Loop Mode 🔄
- **Functionality**: When enabled, the current song will replay automatically when it ends
- **Visual Indicator**: Repeat button turns green when active
- **Persistence**: Loop setting is saved to localStorage and restored on page load

### 4. Shuffle Mode 🔀
- **Functionality**: Enables shuffle playback mode (visual indicator only - playlist shuffle logic can be implemented separately)
- **Visual Indicator**: Shuffle button turns green when active
- **Persistence**: Shuffle setting is saved to localStorage and restored on page load

### 5. Fullscreen Mode 🖥️
- **Functionality**: Expands music player to fullscreen with enhanced UI
- **Features**: 
  - Large album artwork (400x400px)
  - Prominent song information display
  - Enhanced controls layout
  - Beautiful gradient background
  - All player controls accessible
- **Toggle**: Click maximize button or use Alt+F keyboard shortcut

## Keyboard Shortcuts ⌨️

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause current song |
| `Shift + ←` | Skip back 10 seconds |
| `Shift + →` | Skip forward 10 seconds |
| `L` | Toggle loop mode |
| `Ctrl/Cmd + L` | Toggle like for current song |
| `S` | Toggle shuffle mode |
| `Alt + F` | Toggle fullscreen mode |
| `M` | Toggle mute |
| `Alt + ↑` | Increase volume by 10% |
| `Alt + ↓` | Decrease volume by 10% |

## API Endpoints

### Liked Songs
- `GET /api/user/liked-songs/[songId]` - Check if song is liked
- `POST /api/user/liked-songs` - Add song to liked songs
- `DELETE /api/user/liked-songs` - Remove song from liked songs

### Albums
- `GET /api/albums` - Get all available albums
- `POST /api/albums/add-song` - Add song to album

### Play Tracking
- `POST /api/songs/play` - Record song play (existing endpoint)

## Data Persistence

### LocalStorage Settings
- `musicPlayer_volume` - Volume level (0.0 - 1.0)
- `musicPlayer_isLooping` - Loop mode state (true/false)
- `musicPlayer_isShuffling` - Shuffle mode state (true/false)

### Database Storage
- User liked songs stored in `UserLikedSongs` table
- Song album associations stored in `Song.album_id` field
- Play history tracked in `PlayHistory` table

## UI/UX Features

### Regular Player Bar
- Compact design at bottom of screen
- Shows current song info with cover art
- Like and add-to-album buttons
- Play/pause, skip, volume controls
- Progress bar with time display
- Loop, shuffle, and fullscreen toggles

### Fullscreen Mode
- Immersive experience with gradient background
- Large album artwork display
- Prominent song title and artist
- All controls accessible with enhanced spacing
- Easy exit with minimize button

### Responsive Design
- Works on desktop and mobile devices
- Touch-friendly controls
- Keyboard navigation support
- Accessibility considerations

## Authentication Integration

All user-specific features (liking songs, adding to albums) require:
- Valid Supabase authentication session
- Proper authorization headers in API requests
- Graceful fallback when user is not logged in

## Error Handling

- Network failures show user-friendly toast notifications
- Authentication errors handled gracefully
- Audio playback errors logged and handled
- Fallback behaviors for missing data

## Future Enhancements

Potential improvements that could be added:
- Queue management for shuffle mode
- Playlist integration
- Recently played songs
- Social sharing features
- Lyrics display integration
- Equalizer controls
- Cross-fade between tracks
