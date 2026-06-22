import { useState } from 'react';
import { Clipboard, Download, AlertCircle } from 'lucide-react';

function DownloadInput({ placeholder, onDownloadStart, validationType, disabled }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handlePaste = async () => {
    if (disabled) return;
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
      setError('');
    } catch {
      setError('Unable to read clipboard. Please paste manually.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    if (!inputValue.trim()) {
      setError('Please paste a valid Instagram URL.');
      return;
    }

    const value = inputValue.trim();

    // Validate Instagram URL for reels/posts
    const lowerUrl = value.toLowerCase();
    const isInsta = lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am');
    
    if (!isInsta) {
      setError('The link must be a valid Instagram URL.');
      return;
    }

    setError('');
    onDownloadStart(value);
  };

  return (
    <div className="input-box-wrapper">
      <form onSubmit={handleSubmit} className="input-box-form">
        <div className="input-field-container">
          <input
            type="text"
            className="url-input"
            placeholder={placeholder}
            value={inputValue}
            disabled={disabled}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError('');
            }}
          />
          <button
            type="button"
            className="paste-btn"
            disabled={disabled}
            onClick={handlePaste}
            title="Paste from clipboard"
          >
            <Clipboard size={18} />
            <span>Paste</span>
          </button>
        </div>
        <button type="submit" className="download-submit-btn" disabled={disabled}>
          <Download size={18} />
          <span>Download</span>
        </button>
      </form>
      {error && (
        <div className="input-error-msg">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default DownloadInput;
