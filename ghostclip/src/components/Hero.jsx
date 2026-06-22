import InputBox from './InputBox';
import DownloadCard from './DownloadCard';
import mascotImg from '../assets/images/ghost_mascot.png';
import { Heart } from 'lucide-react';
import { Instagram } from './SocialIcons';
import '../styles/Hero.css';

function Hero({ activeTab, onDownloadStart, downloadSession, onResetDownload }) {
  return (
    <section id="hero-section" className="hero-container">
      <div className="hero-grid">
        {/* Left Side: Copy and Input */}
        <div className="hero-left">
          <h1 className="hero-title">
            Ghost<span className="gradient-text">Clip</span>
          </h1>
          <div className="hero-subtitle-container">
            <p className="hero-subtitle-main">
              Download Instagram Reels & Posts
            </p>
            <p className="hero-subtitle-sub">
              Fast, Easy & Free
            </p>
          </div>
          
          {downloadSession.status === 'idle' ? (
            <InputBox key={activeTab} activeTab={activeTab} onDownloadStart={onDownloadStart} />
          ) : (
            <DownloadCard 
              status={downloadSession.status} 
              type={downloadSession.type} 
              url={downloadSession.url} 
              onReset={onResetDownload} 
            />
          )}
        </div>

        {/* Right Side: Illustration */}
        <div className="hero-right">
          <div className="mascot-glow-backdrop"></div>
          <div className="mascot-wrapper">
            <img 
              src={mascotImg} 
              alt="GhostClip Mascot" 
              className="mascot-image"
            />
            {/* Floating items orbiting */}
            <div className="floating-item item-1">
              <Instagram className="floating-icon" size={24} />
            </div>
            <div className="floating-item item-2">
              <Heart className="floating-icon heart-icon" size={20} fill="currentColor" />
            </div>
            <div className="floating-item item-3">
              <Instagram className="floating-icon secondary" size={16} />
            </div>
            <div className="floating-item item-4">
              <Heart className="floating-icon heart-icon secondary" size={18} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
