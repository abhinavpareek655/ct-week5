import yt_dlp
import os

def download_audio(youtube_url, output_path="public/songs/%(title)s.%(ext)s"):
    # Create songs directory if it doesn't exist
    os.makedirs("songs", exist_ok=True)
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'postprocessors': [
            {
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }
        ],
        'quiet': False,
        # Skip post-processing if ffmpeg is not available
        'postprocessor_args': {
            'ffmpeg': ['-i', '%(filepath)s', '-vn', '-acodec', 'libmp3lame', '-ab', '192k', '%(filepath)s.mp3']
        },
        # Add error handling for missing ffmpeg
        'ignoreerrors': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])
        print("Download completed successfully!")
    except Exception as e:
        print(f"Error during download: {e}")
        print("Note: If you see ffmpeg errors, the audio was downloaded but not converted to MP3.")
        print("You can install ffmpeg to enable automatic conversion.")

# Example usage
download_audio("https://www.youtube.com/watch?v=XR7Ev14vUh8?si=38w94UeGbeGKXxSS")
download_audio("https://www.youtube.com/watch?v=4NRXx6U8ABQ?si=h11hcE2xSqv50vIJ")
download_audio("https://www.youtube.com/watch?v=JGwWNGJdvx8?si=Ffr-K_B5E1df7LpJ")
download_audio("https://www.youtube.com/watch?v=7-x3uD5z1bQ?si=Lcm1xaXkIuTHu44o")
download_audio("https://www.youtube.com/watch?v=1j_XvebOg4c?si=yxSduURK_XGoKSrJ")
download_audio("https://www.youtube.com/watch?v=ERkKTCCl5DI?si=v_8oYGgm3trQay9x")
download_audio("https://www.youtube.com/watch?v=g-FXA0nSn8U?si=kJh3W6rcvp28lQyU")
