# Database Schema Documentation

## Current Tables

### Song Table
| column_name | data_type | is_nullable | column_default                     |
| ----------- | --------- | ----------- | ---------------------------------- |
| id          | integer   | NO          | nextval('"Song_id_seq"'::regclass) |
| title       | text      | NO          | null                               |
| artist      | text      | NO          | null                               |
| album       | text      | NO          | null                               |
| genre       | text      | NO          | null                               |
| coverUrl    | text      | NO          | null                               |
| audioUrl    | text      | NO          | null                               |
| plays       | integer   | YES         | 0                                  |
| artist_id   | integer   | YES         | null                               |
| album_id    | integer   | YES         | null                               |

### Lyric Table
| column_name | data_type | is_nullable | column_default                      |
| ----------- | --------- | ----------- | ----------------------------------- |
| id          | integer   | NO          | nextval('"Lyric_id_seq"'::regclass) |
| songId      | integer   | NO          | null                                |
| content     | text      | NO          | null                                |
| synced      | boolean   | YES         | false                               |
| timestamps  | jsonb     | YES         | null                                |

### User Table
| column_name | data_type | is_nullable | column_default |
| ----------- | --------- | ----------- | -------------- |
| id | uuid | NO | gen_random_uuid() |
| email | varchar(255) | NO | null |
| username | varchar(100) | NO | null |
| full_name | varchar(255) | YES | null |
| avatar_url | text | YES | null |
| created_at | timestamp with time zone | YES | now() |
| updated_at | timestamp with time zone | YES | now() |
| is_verified | boolean | YES | false |
| subscription_type | varchar(50) | YES | 'free' |
| last_login | timestamp with time zone | YES | null |
| country | varchar(100) | YES | null |
| timezone | varchar(50) | YES | null |

### Artist Table
| column_name | data_type | is_nullable | column_default |
| ----------- | --------- | ----------- | -------------- |
| id | integer | NO | nextval('"Artist_id_seq"'::regclass) |
| name | varchar(255) | NO | null |
| bio | text | YES | null |
| image_url | text | YES | null |
| verified | boolean | YES | false |
| monthly_listeners | integer | YES | 0 |
| created_at | timestamp with time zone | YES | now() |
| updated_at | timestamp with time zone | YES | now() |
| country | varchar(100) | YES | null |
| genre | varchar(100) | YES | null |
| social_links | jsonb | YES | null |

### Album Table
| column_name | data_type | is_nullable | column_default |
| ----------- | --------- | ----------- | -------------- |
| id | integer | NO | nextval('"Album_id_seq"'::regclass) |
| title | varchar(255) | NO | null |
| artist_id | integer | YES | null |
| cover_url | text | YES | null |
| release_date | date | YES | null |
| genre | varchar(100) | YES | null |
| created_at | timestamp with time zone | YES | now() |
| updated_at | timestamp with time zone | YES | now() |

### Playlist Table
| column_name | data_type | is_nullable | column_default |
| ----------- | --------- | ----------- | -------------- |
| id | integer | NO | nextval('"Playlist_id_seq"'::regclass) |
| name | varchar(255) | NO | null |
| user_id | uuid | YES | null |
| description | text | YES | null |
| cover_url | text | YES | null |
| is_public | boolean | YES | false |
| created_at | timestamp with time zone | YES | now() |
| updated_at | timestamp with time zone | YES | now() |

### UserLikedSongs Table (Junction)
| column_name | data_type | is_nullable | column_default |
| ----------- | --------- | ----------- | -------------- |
| id | integer | NO | nextval('"UserLikedSongs_id_seq"'::regclass) |
| user_id | uuid | YES | null |
| song_id | integer | YES | null |
| liked_at | timestamp with time zone | YES | now() |

### UserPlaylists Table (Junction)
| column_name | data_type | is_nullable | column_default |
| ----------- | --------- | ----------- | -------------- |
| id | integer | NO | nextval('"UserPlaylists_id_seq"'::regclass) |
| user_id | uuid | YES | null |
| playlist_id | integer | YES | null |
| added_at | timestamp with time zone | YES | now() |

### PlaylistSongs Table (Junction)
| column_name | data_type | is_nullable | column_default |
| ----------- | --------- | ----------- | -------------- |
| id | integer | NO | nextval('"PlaylistSongs_id_seq"'::regclass) |
| playlist_id | integer | YES | null |
| song_id | integer | YES | null |
| position | integer | YES | null |
| added_at | timestamp with time zone | YES | now() |

### UserFollowedArtists Table (Junction)
| column_name | data_type | is_nullable | column_default |
| ----------- | --------- | ----------- | -------------- |
| id | integer | NO | nextval('"UserFollowedArtists_id_seq"'::regclass) |
| user_id | uuid | YES | null |
| artist_id | integer | YES | null |
| followed_at | timestamp with time zone | YES | now() |

### GlobalCharts Table
| column_name | data_type | is_nullable | column_default |
| ----------- | --------- | ----------- | -------------- |
| id | integer | NO | nextval('"GlobalCharts_id_seq"'::regclass) |
| region | varchar(100) | NO | null |
| chart_type | varchar(50) | NO | null |
| song_id | integer | YES | null |
| position | integer | NO | null |
| plays | integer | YES | 0 |
| chart_date | date | YES | current_date |
| created_at | timestamp with time zone | YES | now() |

## Views

### songs_with_details
A comprehensive view that joins Song, Artist, Album, and Lyric tables to provide complete song information including artist details, album information, and lyrics.

## Foreign Key Relationships

- **Song.artist_id** → Artist.id
- **Song.album_id** → Album.id
- **Album.artist_id** → Artist.id
- **Lyric.songId** → Song.id
- **Playlist.user_id** → User.id
- **UserLikedSongs.user_id** → User.id
- **UserLikedSongs.song_id** → Song.id
- **UserPlaylists.user_id** → User.id
- **UserPlaylists.playlist_id** → Playlist.id
- **PlaylistSongs.playlist_id** → Playlist.id
- **PlaylistSongs.song_id** → Song.id
- **UserFollowedArtists.user_id** → User.id
- **UserFollowedArtists.artist_id** → Artist.id
- **GlobalCharts.song_id** → Song.id

## Notes
- User table uses UUID for id to match Supabase Auth
- Song and other content tables use INTEGER for id
- All user-related foreign keys use UUID type
- Junction tables handle many-to-many relationships
- Row Level Security (RLS) is enabled on all tables
- Timestamps in Lyric table are stored as JSONB
- GlobalCharts tracks regional chart data with chart_type ('top_songs', 'trending', 'new_releases') 