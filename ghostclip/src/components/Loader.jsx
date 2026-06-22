import { RefreshCw } from 'lucide-react';
import '../styles/downloader.css';

function Loader({ statusText, progress }) {
  return (
    <div className="page-loader-wrapper">
      <div className="download-card glass-card loading-state">
        <div className="loader-container">
          <RefreshCw className="spinner-icon" size={28} />
        </div>
        <div className="loading-content">
          <h4 className="loading-title">Retrieving Content</h4>
          <p className="loading-status-text">{statusText || 'Initiating connection...'}</p>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress || 0}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
