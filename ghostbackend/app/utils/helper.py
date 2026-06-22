import re

# Instagram regex patterns
REEL_PATTERN = re.compile(
    r'^https?://(?:www\.)?instagram\.com/(?:reel|tv|p)/([a-zA-Z0-9_-]+)',
    re.IGNORECASE
)

POST_PATTERN = re.compile(
    r'^https?://(?:www\.)?instagram\.com/p/([a-zA-Z0-9_-]+)',
    re.IGNORECASE
)

USERNAME_PATTERN = re.compile(
    r'^[a-zA-Z0-9._-]{1,30}$'
)

def validate_reel_url(url: str) -> bool:
    """
    Validates if the provided string is a valid Instagram Reel/TV/Post URL.
    """
    if not url or not isinstance(url, str):
        return False
    return bool(REEL_PATTERN.match(url.strip()))

def validate_post_url(url: str) -> bool:
    """
    Validates if the provided string is a valid Instagram Post URL.
    """
    if not url or not isinstance(url, str):
        return False
    return bool(POST_PATTERN.match(url.strip()))

def validate_username(username: str) -> bool:
    """
    Validates if the provided string is a valid Instagram username.
    Instagram usernames can contain letters, numbers, periods, and underscores,
    and are up to 30 characters long.
    """
    if not username or not isinstance(username, str):
        return False
    return bool(USERNAME_PATTERN.match(username.strip()))

def success_response(data: dict, status_code: int = 200):
    """
    Helper to return a standardized success JSON response.
    """
    response_data = {"success": True}
    response_data.update(data)
    return response_data, status_code

def error_response(message: str, status_code: int = 400):
    """
    Helper to return a standardized error JSON response.
    """
    return {
        "success": False,
        "message": message
    }, status_code
