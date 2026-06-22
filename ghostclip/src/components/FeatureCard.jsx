import '../styles/FeatureCard.css';

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="feature-card glass-card">
      <div className="feature-card-icon-wrapper">
        <Icon size={20} className="feature-card-icon" />
      </div>
      <div className="feature-card-content">
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-description">{description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;
