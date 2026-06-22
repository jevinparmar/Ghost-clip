import { CheckCircle, Download, RefreshCw, Copy } from 'lucide-react';
import '../styles/downloader.css'; // Uses existing styles from home's downloader

function ResultCard({ 
  title, 
  subtitle, 
  downloadLabel = 'Download HD', 
  onDownload, 
  onReset, 
  onCopy,
  copyLabel = 'Copy URL',
  layout = 'default',
  children 
}) {
  if (layout === 'centered') {
    return (
      <div className="result-card-container glass-card" style={{ maxWidth: '600px', margin: '32px auto 0 auto', textAlign: 'center' }}>
        <div className="result-status-header" style={{ justifyContent: 'center' }}>
          <CheckCircle className="check-success-icon" size={16} />
          <span className="ready-tag">Download Ready</span>
        </div>

        <div className="result-content-layout" style={{ gap: '20px' }}>
          <div className="result-details-section" style={{ textAlign: 'center' }}>
            <h3 className="result-title" style={{ textAlign: 'center', marginBottom: '8px' }}>{title}</h3>
            <p className="result-subtitle" style={{ textAlign: 'center', marginBottom: '16px' }}>{subtitle}</p>
          </div>

          <div className="result-media-section" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            {children}
          </div>

          <div className="result-details-section">
            <div className="result-actions-group" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <button onClick={onDownload} className="btn-download-media large-btn">
                <Download size={18} />
                <span>{downloadLabel}</span>
              </button>
              {onCopy && (
                <button onClick={onCopy} className="btn-download-another">
                  <Copy size={14} />
                  <span>{copyLabel}</span>
                </button>
              )}
              <button onClick={onReset} className="btn-download-another">
                <RefreshCw size={14} />
                <span>Download Another</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="result-card-container glass-card">
      <div className="result-status-header">
        <CheckCircle className="check-success-icon" size={16} />
        <span className="ready-tag">Download Ready</span>
      </div>

      <div className="result-content-layout">
        {/* Children contains the media elements (previews, columns etc) */}
        <div className="result-media-section">
          {children}
        </div>

        <div className="result-details-section">
          <h3 className="result-title">{title}</h3>
          <p className="result-subtitle">{subtitle}</p>

          <div className="result-actions-group">
            <button onClick={onDownload} className="btn-download-media large-btn">
              <Download size={18} />
              <span>{downloadLabel}</span>
            </button>
            {onCopy && (
              <button onClick={onCopy} className="btn-download-another">
                <Copy size={14} />
                <span>{copyLabel}</span>
              </button>
            )}
            <button onClick={onReset} className="btn-download-another">
              <RefreshCw size={14} />
              <span>Download Another</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
