import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DownloadInput from "../components/DownloadInput";
// import PreviewCard from '../components/PreviewCard';
import ResultCard from "../components/ResultCard";
import StepCard from "../components/StepCard";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMsg";
import Loader from "../components/Loader";
import api from "../services/api";
import "../styles/ReelsPage.css";

function ReelsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initiating request...");
  const [copied, setCopied] = useState(false);

  const handleDownloadStart = async (inputUrl) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(15);
    setStatusText("Connecting to Instagram servers...");

    let currentProgress = 15;
    const progressInterval = setInterval(() => {
      if (currentProgress < 90) {
        currentProgress += Math.floor(Math.random() * 12) + 6;
        if (currentProgress > 90) currentProgress = 90;
        setProgress(currentProgress);
        if (currentProgress > 60) {
          setStatusText("Extracting video streaming link...");
        } else if (currentProgress > 35) {
          setStatusText("Fetching reels metadata...");
        }
      }
    }, 300);

    try {
      const response = await api.post("/api/reels/download", { url: inputUrl });
      clearInterval(progressInterval);
      setProgress(100);
      setStatusText("Download ready!");

      if (response.data && response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.message || "Failed to process Reels download");
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to connect to backend service";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLoading(false);
    setError(null);
    setResult(null);
    setProgress(0);
  };

  const handleDownloadFile = () => {
    if (result && result.video_url) {
      const apiBaseURL = api.defaults.baseURL || "http://127.0.0.1:5000";
      const downloadUrl = `${apiBaseURL}/api/download?url=${encodeURIComponent(result.video_url)}&filename=ghostclip_reel.mp4`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "ghostclip_reel.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyUrl = async () => {
    if (result && result.video_url) {
      try {
        await navigator.clipboard.writeText(result.video_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy url: ", err);
      }
    }
  };

  return (
    <div className="home-page-wrapper">
      <div className="container">
        <Navbar activeTab="reels" />

        <div className="downloader-page-container">
          <div className="downloader-header">
            <h1 className="downloader-title">Instagram Reels Downloader</h1>
            <p className="downloader-subtitle">
              Paste Instagram Reel URL below
            </p>
          </div>

          <DownloadInput
            placeholder="https://www.instagram.com/reel/xxxxxxx/"
            validationType="reel"
            onDownloadStart={handleDownloadStart}
            disabled={loading}
          />

          {loading && <Loader statusText={statusText} progress={progress} />}

          {error && <ErrorMessage message={error} onRetry={handleReset} />}

          {!loading && !error && !result && <EmptyState type="reel" />}

          {!loading && !error && result && (
            <ResultCard
              title="Instagram Reel Ready"
              subtitle="Reels Video (MP4) • High Definition"
              downloadLabel="Download Video"
              onDownload={handleDownloadFile}
              onCopy={handleCopyUrl}
              copyLabel={copied ? "Copied!" : "Copy URL"}
              onReset={handleReset}
              layout="centered"
            >
              {result.video_url && (
                <div
                  className="reels-video-preview-wrapper"
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "280px",
                    borderRadius: "var(--border-radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--card-border)",
                    background: "rgba(0, 0, 0, 0.2)",
                    aspectRatio: "9 / 16",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className="media-glow-effect"></div>
                  <video
                    src={result.video_url}
                    controls
                    className="preview-video"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "var(--border-radius-md)",
                    }}
                  />
                </div>
              )}
            </ResultCard>
          )}

          <section className="instructions-section">
            <h2 className="instructions-title">How to Download?</h2>
            <div className="steps-grid">
              <StepCard number={1} text="Copy Instagram Reel URL" />
              <StepCard number={2} text="Paste in the input box" />
              <StepCard number={3} text="Click Download" />
              <StepCard number={4} text="Enjoy your content" />
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReelsPage;
