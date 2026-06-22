import '../styles/ReelsPage.css';

function StepCard({ number, text }) {
  return (
    <div className="step-card glass-card">
      <div className="step-number-container">
        <span className="step-number">{number}</span>
      </div>
      <p className="step-text">{text}</p>
    </div>
  );
}

export default StepCard;
