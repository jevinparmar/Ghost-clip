from flask import Blueprint
from app.controllers.reels_controller import download_reel

reels_bp = Blueprint('reels', __name__)

@reels_bp.route('/reels/download', methods=['POST'])
def process_reels_download():
    return download_reel()
