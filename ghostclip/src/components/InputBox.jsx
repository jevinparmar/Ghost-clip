import { useState } from 'react';
import { Clipboard, Download, AlertCircle } from 'lucide-react';

function InputBox({ activeTab, onDownloadStart }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'reels':
        return 'Paste Instagram Reel URL here... (e.g., https://instagram.com/reel/...)';
      case 'posts':
        return 'Paste Instagram Post URL here... (e.g., https://instagram.com/p/...)';
      default:
        return 'Paste Instagram URL here...';
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
    } catch {
      setError('Unable to read clipboard. Please paste manually.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please paste a valid Instagram URL.');
      return;
    }
    
    const lowerUrl = url.toLowerCase();
    const isInsta = lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am');
    
    if (!isInsta) {
      setError('The link must be a valid Instagram URL.');
      return;
    }

    setError('');
    onDownloadStart(url, activeTab);
  };

  return (
    <div className="input-box-wrapper">
      <form onSubmit={handleSubmit} className="input-box-form">
        <div className="input-field-container">
          <input
            type="text"
            className="url-input"
            placeholder={getPlaceholder()}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
          />
          <button
            type="button"
            className="paste-btn"
            onClick={handlePaste}
            title="Paste from clipboard"
          >
            <Clipboard size={18} />
            <span>Paste</span>
          </button>
        </div>
        <button type="submit" className="download-submit-btn">
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

export default InputBox;
