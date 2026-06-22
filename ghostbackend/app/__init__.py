import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import routes
from app.routes.reels_route import reels_bp
from app.routes.posts_route import posts_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """
    Flask Application Factory
    """
    # Load env variables from .env
    load_dotenv()
    
    app = Flask(__name__)
    
    # Configure CORS - Enable for specific origins
    CORS(app, resources={r"/*": {"origins": [
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174"
    ]}})
    
    # Register Blueprints
    app.register_blueprint(reels_bp, url_prefix='/api')
    app.register_blueprint(posts_bp, url_prefix='/api')
    
    # Download Proxy Endpoint
    @app.route('/api/download', methods=['GET'])
    def download_file():
        import requests
        from flask import request, Response
        
        url = request.args.get('url')
        if not url:
            return jsonify({
                "success": False,
                "message": "Missing required query parameter: url"
            }), 400
            
        filename = request.args.get('filename', 'ghostclip_media')
        
        try:
            # Set a standard browser User-Agent to bypass CDN hotlinking blocks
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*'
            }
            
            # Fetch the url in streaming mode
            req_res = requests.get(url, headers=headers, stream=True, timeout=30)
            
            # If request fails, try without headers just in case
            if req_res.status_code != 200:
                logger.warning(f"Failed fetching CDN with headers (HTTP {req_res.status_code}), trying without...")
                req_res = requests.get(url, stream=True, timeout=30)
                
            if req_res.status_code != 200:
                logger.error(f"CDN fetch failed: HTTP {req_res.status_code}")
                return jsonify({
                    "success": False,
                    "message": f"Failed to fetch content from URL (HTTP {req_res.status_code})"
                }), 400
                
            content_type = req_res.headers.get('Content-Type', '')
            
            # Match required Content-Type or make it compatible
            if 'image' in content_type.lower():
                pass
            elif 'video' in content_type.lower():
                content_type = 'video/mp4'
            else:
                content_type = 'video/mp4'
                
            # If the user did not specify extension, append it based on Content-Type
            if not any(filename.lower().endswith(ext) for ext in ['.mp4', '.jpg', '.jpeg', '.png', '.gif']):
                if 'image' in content_type.lower():
                    if 'png' in content_type.lower():
                        filename += '.png'
                    else:
                        filename += '.jpg'
                else:
                    filename += '.mp4'
                    
            def generate():
                for chunk in req_res.iter_content(chunk_size=8192):
                    if chunk:
                        yield chunk
                        
            response_headers = {}
            if request.args.get('inline') == 'true':
                response_headers['Content-Disposition'] = 'inline'
            else:
                response_headers['Content-Disposition'] = f'attachment; filename="{filename}"'
            response_headers['Content-Type'] = content_type
            
            return Response(generate(), headers=response_headers)
            
        except Exception as e:
            logger.exception(f"Error during media streaming download: {e}")
            return jsonify({
                "success": False,
                "message": f"Error downloading media: {str(e)}"
            }), 500

    
    # Root Endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            "message": "GhostBackend Running"
        }), 200
        
    # Global Error Handlers
    @app.errorhandler(400)
    def bad_request_error(error):
        message = getattr(error, 'description', 'Invalid Input')
        return jsonify({
            "success": False,
            "message": message
        }), 400

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({
            "success": False,
            "message": "Not Found"
        }), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            "success": False,
            "message": "Internal Server Error"
        }), 500

    @app.errorhandler(Exception)
    def handle_unexpected_exception(error):
        logger.exception(f"Unhandled exception caught: {error}")
        # Show actual error details in development mode
        debug_mode = os.getenv("FLASK_ENV") == "development"
        message = str(error) if debug_mode else "Internal Server Error"
        return jsonify({
            "success": False,
            "message": message
        }), 500
        
    logger.info("Application factory completed successfully.")
    return app
