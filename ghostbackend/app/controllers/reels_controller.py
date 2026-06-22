from flask import request
from app.utils.helper import validate_reel_url, success_response, error_response
from app.services.instagram_service import InstagramService
from app.services.history_service import save_history
import logging

logger = logging.getLogger(__name__)

def download_reel():
    """
    Controller function for Reel download endpoint POST /api/reels/download
    """
    # Log incoming request URL and request type (HTTP method)
    logger.info(f"Incoming Request: {request.method} {request.url}")
    
    try:
        data = request.get_json(silent=True)
        if not isinstance(data, dict) or 'url' not in data:
            logger.error("Request validation failed: Missing or invalid JSON body, or missing 'url' field")
            return error_response("Missing required field: url", 400)
            
        url = data.get('url')
        if not isinstance(url, str):
            logger.error("Request validation failed: 'url' field must be a string")
            return error_response("Invalid field type: url must be a string", 400)
            
        url = url.strip()
        if not url:
            logger.error("Request validation failed: 'url' field is empty")
            return error_response("Field url cannot be empty", 400)
            
        logger.info(f"Target Reel URL: {url}")
        
        if url == "https://www.instagram.com/reel/test/":
            logger.info("Using mock Reel data for local testing")
            return success_response({
                "video_url": "https://www.w3schools.com/html/mov_bbb.mp4"
            })
        
        if not validate_reel_url(url):
            logger.error(f"Request validation failed: Invalid Reel URL format for URL: {url}")
            return error_response("Invalid Reels URL format", 400)
        
        # Call service logic
        result = InstagramService.download_reel(url)
        
        # Check success
        if not result or not result.get("success"):
            error_message = result.get("message", "Failed to process Reel download") if result else "No response from service"
            logger.error(f"Download Reel Failure: {error_message}")
            return error_response(error_message, 400)
            
        video_url = result.get("video_url", "")
        
        # Log to CSV history
        try:
            save_history(
                media_type="reel",
                user_input=url,
                result_data=result
            )
        except Exception as history_err:
            # Never let history logging failure crash the response
            logger.error(f"Failed to save history: {history_err}", exc_info=True)
        
        logger.info("Download Reel Success")
        return success_response({
            "video_url": video_url
        })
        
    except Exception as e:
        logger.error("Exception in download_reel controller", exc_info=True)
        return error_response(f"An unexpected error occurred: {str(e)}", 400)
