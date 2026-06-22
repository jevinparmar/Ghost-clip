import { useState, useEffect } from 'react';
import { RefreshCw, Play, Download, FileText, CheckCircle } from 'lucide-react';
import '../styles/downloader.css';

function DownloadCard({ status, type, onReset }) {
  const [progress, setProgress] = useState(status === 'fetching' ? 15 : 0);
  const [statusText, setStatusText] = useState(
    status === 'fetching' ? 'Connecting to Instagram servers...' : 'Initiating request...'
  );

  useEffect(() => {
    if (status === 'fetching') {
      const t1 = setTimeout(() => {
        setProgress(55);
        setStatusText('Fetching post metadata...');
      }, 1000);

      const t2 = setTimeout(() => {
        setProgress(85);
        setStatusText('Extracting video streaming links...');
      }, 2000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [status]);

  const getTypeName = () => {
    switch (type) {
      case 'reels': return 'Reels Video (MP4)';
      case 'posts': return 'Post Image/Video (HD)';
      default: return 'Instagram Media';
    }
  };

  const getMockTitle = () => {
    return 'Instagram Content by @instagram_creator';
  };

  if (status === 'fetching') {
    return (
      <div className="download-card glass-card loading-state">
        <div className="loader-container">
          <RefreshCw className="spinner-icon" size={28} />
        </div>
        <div className="loading-content">
          <h4 className="loading-title">Retrieving Content</h4>
          <p className="loading-status-text">{statusText}</p>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'ready') {
    return (
      <div className="download-card glass-card ready-state">
        <div className="media-preview-container">
          <div className="media-preview-mock">
            <div className="glow-effect-overlay"></div>
            {type === 'reels' ? (
              <Play className="preview-play-icon" size={32} />
            ) : (
              <FileText className="preview-doc-icon" size={32} />
            )}
          </div>
        </div>
        
        <div className="media-details-container">
          <div className="ready-header">
            <CheckCircle className="check-success-icon" size={14} />
            <span className="ready-tag">Ready for download</span>
          </div>
          <h4 className="media-title">{getMockTitle()}</h4>
          <p className="media-meta-type">{getTypeName()}</p>
          
          <div className="action-buttons-group">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                alert('Success! GhostClip simulated download successfully in full high-definition.');
              }} 
              className="btn-download-media"
            >
              <Download size={14} />
              <span>Download (HD)</span>
            </a>
            <button onClick={onReset} className="btn-download-another">
              <RefreshCw size={12} />
              <span>Download Another</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default DownloadCard;
