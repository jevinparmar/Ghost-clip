import { ArrowDownCircle } from 'lucide-react';
import '../styles/downloader.css';

function EmptyState({ type }) {
  const getMessage = () => {
    switch (type) {
      case 'reels':
      case 'reel':
        return 'Paste an Instagram Reel URL to extract the high-definition video source.';
      case 'posts':
      case 'post':
        return 'Paste an Instagram Post URL to extract all images and carousel media items.';
      default:
        return 'Paste a link to start downloading high quality media.';
    }
  };

  return (
    <div className="empty-state-container">
      <div className="empty-state-icon-wrapper">
        <ArrowDownCircle className="empty-state-icon" size={32} />
      </div>
      <h4 className="empty-state-title">Awaiting Media URL</h4>
      <p className="empty-state-text">{getMessage()}</p>
    </div>
  );
}

export default EmptyState;
