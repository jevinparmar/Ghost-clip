import { AlertCircle, RefreshCw } from 'lucide-react';
import '../styles/downloader.css';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="download-card glass-card error-state">
      <div className="error-icon-container">
        <AlertCircle size={24} />
      </div>
      <div className="error-content">
        <h4 className="error-title">Request Failed</h4>
        <p className="error-message-text">{message || 'Something went wrong. Please check your link or username and try again.'}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-download-another">
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
export { ErrorMessage };
