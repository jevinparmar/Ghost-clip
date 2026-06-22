import { Ghost } from 'lucide-react';
import { Facebook, Twitter, Instagram, Youtube } from './SocialIcons';
import { useNavigate } from 'react-router-dom';
import '../styles/footer.css';

function Footer({ setActiveTab }) {
  const navigate = useNavigate();

  const handleToolClick = (tab) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
    const paths = {
      reels: '/reels',
      posts: '/posts'
    };
    const path = paths[tab];
    if (path) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-container">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Info and Socials */}
          <div className="footer-col info-col">
            <div className="footer-logo">
              <div className="logo-icon-wrapper small">
                <Ghost className="logo-icon" size={18} />
              </div>
              <span className="logo-text small">Ghost<span className="logo-highlight">Clip</span></span>
            </div>
            <p className="footer-description">
              GhostClip is a free tool to download Instagram Reels and Posts in high quality.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Tools Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Tools</h4>
            <ul className="footer-links-list">
              <li><button onClick={() => handleToolClick('reels')} className="footer-link-btn">Reels Downloader</button></li>
              <li><button onClick={() => handleToolClick('posts')} className="footer-link-btn">Post Downloader</button></li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links-list">
              <li><a href="#about" className="footer-link">About Us</a></li>
              <li><a href="#contact" className="footer-link">Contact Us</a></li>
              <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
              <li><a href="#terms" className="footer-link">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Link */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <a href="mailto:support@ghostclip.app" className="contact-email">
              support@ghostclip.app
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 GhostClip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
