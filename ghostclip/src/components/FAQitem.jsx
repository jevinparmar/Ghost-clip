import { ChevronDown } from 'lucide-react';
import '../styles/FAQ.css';

function FAQitem({ question, answer, isOpen, onClick }) {
  return (
    <div className={`faq-item glass-card ${isOpen ? 'open' : ''}`} onClick={onClick}>
      <button className="faq-question-btn" aria-expanded={isOpen}>
        <span className="faq-question-text">{question}</span>
        <ChevronDown className="faq-chevron" size={18} />
      </button>
      <div className="faq-answer-wrapper" style={{ maxHeight: isOpen ? '200px' : '0' }}>
        <div className="faq-answer-content">
          <p className="faq-answer-text">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default FAQitem;
