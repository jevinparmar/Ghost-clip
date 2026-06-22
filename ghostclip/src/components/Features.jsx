import FeatureCard from './FeatureCard';
import { Zap, ShieldCheck, Award, Smartphone } from 'lucide-react';

function Features() {
  const featuresList = [
    {
      title: 'Fast Downloads',
      description: 'Super fast and reliable',
      icon: Zap,
    },
    {
      title: 'HD Quality',
      description: 'Download in high quality',
      icon: Award,
    },
    {
      title: 'No Login Required',
      description: '100% free and secure',
      icon: ShieldCheck,
    },
    {
      title: 'Works on All Devices',
      description: 'Mobile, Tablet & Desktop',
      icon: Smartphone,
    },
  ];

  return (
    <section id="features-section" className="features-container">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why choose GhostClip?</h2>
          <div className="section-title-underline"></div>
        </div>
        <div className="features-grid">
          {featuresList.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
