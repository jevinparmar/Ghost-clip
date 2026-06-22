import os
import re
import logging
import subprocess
import json
import yt_dlp
from instagrapi import Client

logger = logging.getLogger(__name__)

# Helpers for yt-dlp, gallery-dl, and instagrapi

def extract_with_ytdlp(url):
    """
    Extracts media info using yt-dlp.
    Returns (video_url, thumbnail_url, list_of_images).
    """
    username = os.getenv("INSTAGRAM_USERNAME")
    password = os.getenv("INSTAGRAM_PASSWORD")

    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
    }
    if username and password:
        ydl_opts['username'] = username
        ydl_opts['password'] = password

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        video_url = info.get("url") or info.get("requested_formats", [{}])[0].get("url")
        thumbnail = info.get("thumbnail")
        
        # Extract images if it's a carousel / multiple images
        images = []
        if info.get("thumbnails"):
            images = [t["url"] for t in info["thumbnails"] if "url" in t]
        elif thumbnail:
            images = [thumbnail]
            
        return video_url, thumbnail, images


def extract_with_gallery_dl(url):
    """
    Extracts media info using gallery-dl subprocess.
    Returns (list_of_videos, list_of_images).
    """
    username = os.getenv("INSTAGRAM_USERNAME")
    password = os.getenv("INSTAGRAM_PASSWORD")

    # Construct the path to gallery-dl.exe
    gallery_dl_path = os.path.abspath(os.path.join(
        os.path.dirname(__file__), '..', '..', 'venv', 'Scripts', 'gallery-dl.exe'
    ))
    # Fallback to general gallery-dl if venv path is not resolved
    if not os.path.exists(gallery_dl_path):
        gallery_dl_path = "gallery-dl"

    cmd = [gallery_dl_path, "-j"]
    if username and password:
        cmd.extend(["--username", username, "--password", password])
    cmd.append(url)

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"gallery-dl failed with exit code {result.returncode}: {result.stderr or result.stdout}")

    try:
        data = json.loads(result.stdout)
    except Exception as je:
        raise Exception(f"Failed to parse gallery-dl JSON output: {je}")

    videos = []
    images = []
    for item in data:
        if isinstance(item, list) and len(item) > 1:
            obj = item[1]
            if isinstance(obj, dict) and 'url' in obj:
                media_url = obj['url']
                # Categorize URL
                if ".mp4" in media_url.lower() or "video" in media_url.lower() or "/v/" in media_url.lower():
                    videos.append(media_url)
                else:
                    images.append(media_url)

    return videos, images


_instagrapi_client = None

def get_instagrapi_client():
    """
    Initializes and returns a cached instagrapi Client.
    """
    global _instagrapi_client
    if _instagrapi_client is not None:
        return _instagrapi_client

    cl = Client()
    username = os.getenv("INSTAGRAM_USERNAME")
    password = os.getenv("INSTAGRAM_PASSWORD")

    if username and password:
        session_file = os.path.abspath(os.path.join(
            os.path.dirname(__file__), '..', '..', 'storage', f"instagrapi_{username}.json"
        ))
        os.makedirs(os.path.dirname(session_file), exist_ok=True)
        try:
            if os.path.exists(session_file):
                cl.load_settings(session_file)
                logger.info(f"Loaded instagrapi settings from {session_file}")
                try:
                    # Validate session
                    cl.get_timeline_feed()
                except Exception:
                    logger.warning("Instagrapi session expired. Logging in again...")
                    cl.login(username, password)
                    cl.dump_settings(session_file)
            else:
                logger.info(f"Performing fresh instagrapi login for {username}...")
                cl.login(username, password)
                cl.dump_settings(session_file)
        except Exception as e:
            logger.error(f"Failed instagrapi login: {e}", exc_info=True)
            # Try login without loading settings
            try:
                cl.login(username, password)
            except Exception as e2:
                logger.error(f"Failed direct instagrapi login fallback: {e2}", exc_info=True)
                raise e2
    else:
        logger.info("No credentials provided for instagrapi. Operating anonymously.")

    _instagrapi_client = cl
    return _instagrapi_client


def handle_instagram_block_msg(e):
    """
    Checks if an exception suggests that Instagram blocked the request.
    """
    err_str = str(e).lower()
    block_keywords = ["429", "403", "too many requests", "forbidden", "blocked", "login page", "login required", "abortextraction", "empty media response"]
    if any(k in err_str for k in block_keywords):
        return "Instagram temporarily blocked this request."
    return None


class InstagramService:
    @staticmethod
    def extract_shortcode(url: str) -> str:
        """
        Extracts the shortcode from an Instagram URL.
        Example: https://instagram.com/reel/C8q7_Koxxxx/ -> C8q7_Koxxxx
        """
        match = re.search(r'/(?:p|reel|tv)/([a-zA-Z0-9_-]+)', url)
        if match:
            return match.group(1)
        return ""

    @classmethod
    def download_reel(cls, url: str) -> dict:
        """
        Downloads a Reel from a given Instagram URL.
        Returns:
            dict containing success, thumbnail, and video_url.
        """
        logger.info(f"Processing Reel download request for URL: {url}")
        
        # 1. Try yt-dlp (Primary)
        try:
            video_url, thumbnail, images = extract_with_ytdlp(url)
            if video_url:
                logger.info("Successfully extracted Reel with yt-dlp")
                return {
                    "success": True,
                    "video_url": str(video_url).strip()
                }
        except Exception as e:
            logger.warning(f"yt-dlp Reel extraction failed: {e}", exc_info=True)
            
        # 2. Try gallery-dl (Secondary)
        try:
            videos, images = extract_with_gallery_dl(url)
            if videos:
                logger.info("Successfully extracted Reel with gallery-dl")
                return {
                    "success": True,
                    "video_url": str(videos[0]).strip()
                }
        except Exception as e:
            logger.warning(f"gallery-dl Reel extraction failed: {e}", exc_info=True)

        # 3. Try instagrapi (Tertiary)
        try:
            cl = get_instagrapi_client()
            media_pk = cl.media_pk_from_url(url)
            media = cl.media_info(media_pk)
            if media and media.video_url:
                logger.info("Successfully extracted Reel with instagrapi")
                return {
                    "success": True,
                    "video_url": str(media.video_url).strip()
                }
        except Exception as e:
            logger.error(f"instagrapi Reel extraction failed: {e}", exc_info=True)
            block_msg = handle_instagram_block_msg(e)
            if block_msg:
                return {"success": False, "message": block_msg}
            return {"success": False, "message": f"All download attempts failed: {str(e)}"}

        return {"success": False, "message": "All download attempts failed. Check if URL is private or if access is blocked."}

    @classmethod
    def download_post(cls, url: str) -> dict:
        """
        Downloads a post (single/multiple image carousel) from a given Instagram URL.
        Returns:
            dict containing success and list of images.
        """
        logger.info(f"Processing Post download request for URL: {url}")
        
        # 1. Try gallery-dl (Primary for images)
        try:
            videos, images = extract_with_gallery_dl(url)
            if images:
                logger.info("Successfully extracted Post images with gallery-dl")
                return {
                    "success": True,
                    "images": images
                }
        except Exception as e:
            logger.warning(f"gallery-dl Post extraction failed: {e}", exc_info=True)

        # 2. Try yt-dlp (Secondary)
        try:
            video_url, thumbnail, images = extract_with_ytdlp(url)
            if images:
                logger.info("Successfully extracted Post images with yt-dlp")
                return {
                    "success": True,
                    "images": images
                }
        except Exception as e:
            logger.warning(f"yt-dlp Post extraction failed: {e}", exc_info=True)

        # 3. Try instagrapi (Tertiary)
        try:
            cl = get_instagrapi_client()
            media_pk = cl.media_pk_from_url(url)
            media = cl.media_info(media_pk)
            if media:
                images = []
                if media.resources:
                    images = [str(res.thumbnail_url or res.video_url) for res in media.resources if res.thumbnail_url or res.video_url]
                else:
                    images = [str(media.thumbnail_url or media.video_url)]
                logger.info("Successfully extracted Post images with instagrapi")
                return {
                    "success": True,
                    "images": images
                }
        except Exception as e:
            logger.error(f"instagrapi Post extraction failed: {e}", exc_info=True)
            block_msg = handle_instagram_block_msg(e)
            if block_msg:
                return {"success": False, "message": block_msg}
            return {"success": False, "message": f"All download attempts failed: {str(e)}"}

        return {"success": False, "message": "All download attempts failed. Check if URL is private or if access is blocked."}


