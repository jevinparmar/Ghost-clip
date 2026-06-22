import { useState } from 'react';
import FAQitem from './FAQitem';
import '../styles/FAQ.css';

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Is GhostClip free to use?',
      answer: 'Yes, GhostClip is 100% free to use. You can download as many Reels and posts as you want without paying anything.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No, you do not need to create an account or sign up. We do not ask for any personal credentials, making it secure and convenient.',
    },
    {
      question: 'Is it safe to use GhostClip?',
      answer: 'Absolutely! GhostClip does not host any malicious software and runs directly in your browser. We do not save your downloads or personal data.',
    },
    {
      question: 'Which devices are supported?',
      answer: 'GhostClip is web-based and works seamlessly on all devices including iOS (iPhone/iPad), Android smartphones/tablets, Windows, macOS, and Linux.',
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="faq-container">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="section-title-underline"></div>
        </div>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <FAQitem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
