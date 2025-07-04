# Database Schema Documentation

## Current Tables

### Song
| column_name | data_type | is_nullable | column_default                     |
| ----------- | --------- | ----------- | ---------------------------------- |
| id          | integer   | NO          | nextval('"Song_id_seq"'::regclass) |
| plays       | integer   | YES         | 0                                  |
| artist_id   | integer   | YES         | null                               |
| album_id    | integer   | YES         | null                               |
| genre       | text      | NO          | null                               |
| cover_url    | text      | NO          | null                               |
| audio_url    | text      | NO          | null                               |
| title       | text      | NO          | null                               |
| artist      | text      | NO          | null                               |
| album       | text      | NO          | null                               |

### Lyric
| column_name | data_type | is_nullable | column_default                      |
| ----------- | --------- | ----------- | ----------------------------------- |
| id          | integer   | NO          | nextval('"Lyric_id_seq"'::regclass) |
| songId      | integer   | NO          | null                                |
| synced      | boolean   | YES         | false                               |
| timestamps  | jsonb     | YES         | null                                |
| content     | text      | NO          | null                                |

### User
| column_name       | data_type                | is_nullable | column_default            |
| ----------------- | ------------------------ | ----------- | ------------------------- |
| id                | uuid                     | NO          | gen_random_uuid()         |
| created_at        | timestamp with time zone | YES         | now()                     |
| updated_at        | timestamp with time zone | YES         | now()                     |
| is_verified       | boolean                  | YES         | false                     |
| last_login        | timestamp with time zone | YES         | null                      |
| timezone          | character varying        | YES         | null                      |
| country           | character varying        | YES         | null                      |
| email             | character varying        | NO          | null                      |
| full_name         | character varying        | YES         | null                      |
| avatar_url        | text                     | YES         | null                      |
| subscription_type | character varying        | YES         | 'free'::character varying |

### Artist
| column_name       | data_type                | is_nullable | column_default                       |
| ----------------- | ------------------------ | ----------- | ------------------------------------ |
| social_links      | jsonb                    | YES         | null                                 |
| verified          | boolean                  | YES         | false                                |
| monthly_listeners | integer                  | YES         | 0                                    |
| created_at        | timestamp with time zone | YES         | now()                                |
| updated_at        | timestamp with time zone | YES         | now()                                |
| id                | integer                  | NO          | nextval('"Artist_id_seq"'::regclass) |
| name              | character varying        | NO          | null                                 |
| bio               | text                     | YES         | null                                 |
| image_url         | text                     | YES         | null                                 |
| country           | character varying        | YES         | null                                 |
| genre             | character varying        | YES         | null                                 |

### Album
| column_name  | data_type                | is_nullable | column_default                      |
| ------------ | ------------------------ | ----------- | ----------------------------------- |
| updated_at   | timestamp with time zone | YES         | now()                               |
| release_date | date                     | YES         | null                                |
| created_at   | timestamp with time zone | YES         | now()                               |
| id           | integer                  | NO          | nextval('"Album_id_seq"'::regclass) |
| artist_id    | integer                  | YES         | null                                |
| title        | character varying        | NO          | null                                |
| genre        | character varying        | YES         | null                                |
| cover_url    | text                     | YES         | null                                |

### Playlist
| column_name | data_type                | is_nullable | column_default                         |
| ----------- | ------------------------ | ----------- | -------------------------------------- |
| id          | integer                  | NO          | nextval('"Playlist_id_seq"'::regclass) |
| is_public   | boolean                  | YES         | false                                  |
| created_at  | timestamp with time zone | YES         | now()                                  |
| updated_at  | timestamp with time zone | YES         | now()                                  |
| user_id     | uuid                     | YES         | null                                   |
| name        | character varying        | NO          | null                                   |
| cover_url   | text                     | YES         | null                                   |
| description | text                     | YES         | null                                   |

### UserLikedSongs
| column_name | data_type                | is_nullable | column_default                               |
| ----------- | ------------------------ | ----------- | -------------------------------------------- |
| id          | integer                  | NO          | nextval('"UserLikedSongs_id_seq"'::regclass) |
| user_id     | uuid                     | YES         | null                                         |
| song_id     | integer                  | YES         | null                                         |
| liked_at    | timestamp with time zone | YES         | now()                                        |

### PlaylistSong 
| column_name | data_type                | is_nullable | column_default                             |
| ----------- | ------------------------ | ----------- | ------------------------------------------ |
| id          | integer                  | NO          | nextval('"PlaylistSong_id_seq"'::regclass) |
| playlist_id | integer                  | YES         | null                                       |
| song_id     | integer                  | YES         | null                                       |
| added_at    | timestamp with time zone | YES         | now()                                      |

### UserFollowedArtists
| column_name | data_type                | is_nullable | column_default                                    |
| ----------- | ------------------------ | ----------- | ------------------------------------------------- |
| id          | integer                  | NO          | nextval('"UserFollowedArtists_id_seq"'::regclass) |
| user_id     | uuid                     | YES         | null                                              |
| artist_id   | integer                  | YES         | null                                              |
| followed_at | timestamp with time zone | YES         | now()                                             |

### GlobalCharts
| column_name | data_type                | is_nullable | column_default                             |
| ----------- | ------------------------ | ----------- | ------------------------------------------ |
| created_at  | timestamp with time zone | YES         | now()                                      |
| chart_date  | date                     | YES         | CURRENT_DATE                               |
| id          | integer                  | NO          | nextval('"GlobalCharts_id_seq"'::regclass) |
| song_id     | integer                  | YES         | null                                       |
| position    | integer                  | NO          | null                                       |
| plays       | integer                  | YES         | 0                                          |
| region      | character varying        | NO          | null                                       |
| chart_type  | character varying        | NO          | null                                       |

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