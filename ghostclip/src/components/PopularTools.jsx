import ToolCard from './ToolCard';
import { Film, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PopularTools({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const tools = [
    {
      id: 'reels',
      title: 'Reels Downloader',
      description: 'Download Instagram Reels',
      icon: Film,
      path: '/reels',
    },
    {
      id: 'posts',
      title: 'Post Downloader',
      description: 'Download Posts & Videos',
      icon: Image,
      path: '/posts',
    },
  ];

  return (
    <section id="popular-tools-section" className="popular-tools-container">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Popular Tools</h2>
          <div className="section-title-underline"></div>
        </div>
        <div className="popular-tools-grid">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              isActive={activeTab === tool.id}
              onClick={() => {
                if (setActiveTab) {
                  setActiveTab(tool.id);
                }
                navigate(tool.path);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularTools;
