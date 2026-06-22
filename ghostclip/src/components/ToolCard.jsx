import '../styles/ToolCard.css';

function ToolCard({ icon: Icon, title, description, isActive, onClick }) {
  return (
    <div 
      className={`tool-card glass-card ${isActive ? 'active' : ''}`} 
      onClick={onClick}
    >
      <div className="tool-card-icon-wrapper">
        <Icon size={24} className="tool-card-icon" />
      </div>
      <h3 className="tool-card-title">{title}</h3>
      <p className="tool-card-description">{description}</p>
    </div>
  );
}

export default ToolCard;
