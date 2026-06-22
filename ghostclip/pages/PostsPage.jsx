import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DownloadInput from '../components/DownloadInput';
import ResultCard from '../components/ResultCard';
import StepCard from '../components/StepCard';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMsg';
import Loader from '../components/Loader';
import api from '../services/api';
import { Download } from 'lucide-react';
import '../styles/ReelsPage.css'; // sharing layouts
import '../styles/PostsPage.css';

function PostsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initiating request...');
  const [url, setUrl] = useState('');
  const fallbackImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';

  const handleDownloadStart = async (inputUrl) => {
    setUrl(inputUrl);
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(15);
    setStatusText('Connecting to Instagram servers...');

    let currentProgress = 15;
    const progressInterval = setInterval(() => {
      if (currentProgress < 90) {
        currentProgress += Math.floor(Math.random() * 12) + 6;
        if (currentProgress > 90) currentProgress = 90;
        setProgress(currentProgress);
        if (currentProgress > 60) {
          setStatusText('Extracting post media items...');
        } else if (currentProgress > 35) {
          setStatusText('Fetching post metadata...');
        }
      }
    }, 300);

    try {
      const response = await api.post('/api/posts/download', { url: inputUrl });
      clearInterval(progressInterval);
      setProgress(100);
      setStatusText('Download ready!');

      if (response.data && response.data.success) {
        setResult(response.data);
        console.log('Result:', response.data);
        console.log('Images:', response.data.images);
      } else {
        setError(response.data.message || 'Failed to process Post download');
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errMsg = err.response?.data?.message || err.message || 'Failed to connect to backend service';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setLoading(false);
    setError(null);
    setResult(null);
    setProgress(0);
  };

  // Extract the preview URL for the image card. The backend now returns { preview, download }.
  const getImagePreview = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img; // fallback for legacy data
    if (img.preview) return img.preview;
    // Backward compatibility with older field names
    return img.url || img.image_url || img.src || img.imageUrl || null;
  };

  // Download all images using the backend-provided download URLs.
  const handleDownloadAll = () => {
    if (Array.isArray(result?.images) && result.images.length > 0) {
      result.images.forEach((imgObj, index) => {
        const downloadUrl = imgObj.download;
        if (!downloadUrl || !downloadUrl.startsWith('http')) {
          console.warn('Missing download URL for image', index);
          return;
        }
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `ghostclip_post_${index + 1}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, index * 300);
      });
    }
  };

  return (
    <div className="home-page-wrapper">
      <div className="container">
        <Navbar activeTab="posts" />

        <div className="downloader-page-container">
          <div className="downloader-header">
            <h1 className="downloader-title">Instagram Post Downloader</h1>
            <p className="downloader-subtitle">
              Paste Instagram Post URL below
            </p>
          </div>

          <DownloadInput
            placeholder="https://www.instagram.com/p/xxxxxxx/"
            validationType="post"
            onDownloadStart={handleDownloadStart}
            disabled={loading}
          />

          {loading && (
            <Loader statusText={statusText} progress={progress} />
          )}

          {error && (
            <ErrorMessage message={error} onRetry={handleReset} />
          )}

          {!loading && !error && (!result || !Array.isArray(result.images) || result.images.length === 0) && (
            <EmptyState type="post" />
          )}

          {!loading && !error && result && Array.isArray(result.images) && result.images.length > 0 && (
            <ResultCard
              title="Instagram Post Ready"
              subtitle={`Post Images (HD) • ${result.images.length} items extracted`}
              downloadLabel="Download Image Pack"
              onDownload={handleDownloadAll}
              onReset={handleReset}
            >
              <div className="posts-result-grid">
                {result.images.map((image, index) => {
                  const previewUrl = getImagePreview(image);
                  console.log('image object:', image);
                  console.log('preview URL:', previewUrl);
                  if (!previewUrl || typeof previewUrl !== 'string' || !previewUrl.startsWith('http')) return null;
                  return (
                    <div key={index} className="post-card">
                      <img
                        src={previewUrl}
                        alt={`Instagram Post ${index + 1}`}
                        className="post-image"
                        loading="lazy"
                        onError={(e) => {
                          console.log('Failed image:', e.target.src);
                          e.target.src = fallbackImage;
                        }}
                      />
                      <button
                        onClick={() => {
                          const downloadUrl = image.download;
                          if (downloadUrl && downloadUrl.startsWith('http')) {
                            const link = document.createElement('a');
                            link.href = downloadUrl;
                            link.download = `ghostclip_post_${index + 1}.jpg`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } else {
                            console.warn('No download URL for image', index);
                          }
                        }}
                        className="btn-download-media"
                      >
                        <Download size={14} />
                        <span>Download Image</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </ResultCard>
          )}

          <section className="instructions-section">
            <h2 className="instructions-title">How to Download?</h2>
            <div className="steps-grid">
              <StepCard number={1} text="Copy URL" />
              <StepCard number={2} text="Paste URL" />
              <StepCard number={3} text="Click Download" />
              <StepCard number={4} text="Save Image" />
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PostsPage;
