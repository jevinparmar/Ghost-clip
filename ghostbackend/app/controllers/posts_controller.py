from flask import request
from urllib.parse import quote
from app.utils.helper import validate_post_url, success_response, error_response
from app.services.instagram_service import InstagramService
from app.services.history_service import save_history
import logging

logger = logging.getLogger(__name__)

def download_post():
    """
    Controller function for Post download endpoint POST /api/posts/download
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
            
        logger.info(f"Target Post URL: {url}")
        
        if url == "https://www.instagram.com/p/test/":
            logger.info("Using mock Post data for local testing")
            mock_images = [
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
                "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800"
            ]
            formatted_images = []
            for idx, img_url in enumerate(mock_images, start=1):
                download_url = f"{request.host_url.rstrip('/')}/api/download?url={quote(img_url)}&filename=ghostclip_post_{idx}.jpg"
                preview_url = f"{request.host_url.rstrip('/')}/api/download?url={quote(img_url)}&inline=true"
                formatted_images.append({
                    "preview": preview_url,
                    "download": download_url
                })
            return success_response({
                "images": formatted_images
            })

        if not validate_post_url(url):
            logger.error(f"Request validation failed: Invalid Post URL format for URL: {url}")
            return error_response("Invalid Post URL format", 400)
        
        # Call service logic
        result = InstagramService.download_post(url)
        
        # Check success
        if not result or not result.get("success"):
            error_message = result.get("message", "Failed to process Post download") if result else "No response from service"
            logger.error(f"Download Post Failure: {error_message}")
            return error_response(error_message, 400)
            
        images = result.get("images", [])
        
        # Format images to preview/download structure expected by the frontend
        formatted_images = []
        for idx, img_url in enumerate(images, start=1):
            download_url = f"{request.host_url.rstrip('/')}/api/download?url={quote(img_url)}&filename=ghostclip_post_{idx}.jpg"
            preview_url = f"{request.host_url.rstrip('/')}/api/download?url={quote(img_url)}&inline=true"
            formatted_images.append({
                "preview": preview_url,
                "download": download_url
            })

        # Log to CSV history
        try:
            save_history(
                media_type="post",
                user_input=url,
                result_data={"success": True, "images": formatted_images}
            )
        except Exception as history_err:
            # Never let history logging failure crash the response
            logger.error(f"Failed to save history: {history_err}", exc_info=True)
        
        logger.info("Download Post Success")
        return success_response({
            "images": formatted_images
        })
        
    except Exception as e:
        logger.error("Exception in download_post controller", exc_info=True)
        return error_response(f"An unexpected error occurred: {str(e)}", 400)
