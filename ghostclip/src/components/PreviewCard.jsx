import { useState, useEffect } from 'react';
import { Play, Film, Image as ImageIcon } from 'lucide-react';
import '../styles/ReelsPage.css'; // sharing classes

function PreviewCard({ type = 'image', src, title, creator = '@instagram_creator', duration }) {
  const fallbackImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
  const [imgSrc, setImgSrc] = useState(src || fallbackImage);

  useEffect(() => {
    setImgSrc(src || fallbackImage);
  }, [src]);

  const handleImageError = () => {
    setImgSrc(fallbackImage);
  };

  const renderContent = () => {
    if (type === 'video') {
      return (
        <div className="preview-media-container video-type">
          <div className="preview-media-wrapper">
            <div className="media-glow-effect"></div>
            {src ? (
              <video src={src} controls className="preview-video" poster={src} />
            ) : (
              <div className="mock-video-preview">
                <Film className="mock-media-icon animate-pulse" size={48} />
                <div className="play-button-overlay">
                  <Play className="play-icon" size={24} fill="currentColor" />
                </div>
              </div>
            )}
            {duration && <span className="media-duration-badge">{duration}</span>}
          </div>
          <div className="preview-info-box">
            <h4 className="preview-info-title">{title || 'Reels Video'}</h4>
            <p className="preview-info-creator">{creator}</p>
          </div>
        </div>
      );
    }

    // Default: image type
    return (
      <div className="preview-media-container image-type">
        <div className="preview-media-wrapper">
          <div className="media-glow-effect"></div>
          <img 
            src={imgSrc} 
            alt={title || 'Instagram Post'} 
            className="preview-image" 
            onError={handleImageError}
          />
        </div>
        <div className="preview-info-box">
          <h4 className="preview-info-title">{title || 'Post Image'}</h4>
          <p className="preview-info-creator">{creator}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="preview-card glass-card">
      {renderContent()}
    </div>
  );
}

export default PreviewCard;
