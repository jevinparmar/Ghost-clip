from flask import Blueprint
from app.controllers.posts_controller import download_post

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('/posts/download', methods=['POST'])
def process_posts_download():
    return download_post()
