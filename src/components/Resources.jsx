import React, { useState } from 'react';
import '../styles/Resources.css';

import {
  Play,
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

export default function Resources() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const resources = [
    {
      id: 1,
      title: "What Happens to Your Body When You Eat Too Much Salt",
      description: "Learn about the health impacts of excess salt and how to reduce your intake.",
      youtubeUrl: "https://youtu.be/XQ9e766K5ZI?si=3mtTBEJMW1Q81l4p",
      thumbnail: "https://img.youtube.com/vi/XQ9e766K5ZI/0.jpg",
      duration: "5:09",
      channel: "Healthline",
      type: "video"
    },
    {
      id: 2,
      title: "Tips to Cut Down on Salt",
      description: "Practical lifestyle tips to help reduce salt in your daily diet.",
      youtubeUrl: "https://youtu.be/zJY3KEF-_MU?si=PEgwsu_t9G6ZltAy",
      thumbnail: "https://img.youtube.com/vi/zJY3KEF-_MU/0.jpg",
      duration: "2:40",
      channel: "American Heart Association",
      type: "video"
    },
    {
      id: 3,
      title: "Hidden Salt in Processed Foods",
      description: "Explore the hidden sources of sodium in everyday packaged foods.",
      youtubeUrl: "https://youtu.be/cg3XVJJugpw?si=2p4j_YoPPbI0MACm",
      thumbnail: "https://img.youtube.com/vi/cg3XVJJugpw/0.jpg",
      duration: "3:25",
      channel: "BBC News",
      type: "video"
    },
    {
      id: 4,
      title: "How to Read Nutrition Labels for Sodium",
      description: "Learn how to identify sodium content on food labels.",
      youtubeUrl: "https://youtu.be/e67EgB_fHBQ?si=E6n4rC4S66veYs2W",
      thumbnail: "https://img.youtube.com/vi/e67EgB_fHBQ/0.jpg",
      duration: "4:32",
      channel: "Mayo Clinic",
      type: "video"
    },
    {
      id: 5,
      title: "Discovery Vitality Salt Smart",
      description: "Track and improve your salt intake with this program from Discovery Health.",
      websiteUrl: "https://www.discovery.co.za/vitality/salt-smart",
      type: "website"
    },
    {
      id: 6,
      title: "Heart Foundation: Salt Awareness",
      description: "Guidelines and tips from the Heart Foundation to reduce salt in your diet.",
      websiteUrl: "https://www.heartfoundation.org.au/health-professional-tools/salt-awareness",
      type: "website"
    },
    {
      id: 7,
      title: "World Health Organization: Sodium Intake",
      description: "WHO guidelines and facts about sodium and health.",
      websiteUrl: "https://www.who.int/news-room/fact-sheets/detail/salt-reduction",
      type: "website"
    }
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || resource.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="resources-container">
      <div className="resources-controls">
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button onClick={() => setActiveFilter('all')} className={activeFilter === 'all' ? 'active' : ''}>
            All
          </button>
          <button onClick={() => setActiveFilter('video')} className={activeFilter === 'video' ? 'active' : ''}>
            Videos
          </button>
          <button onClick={() => setActiveFilter('website')} className={activeFilter === 'website' ? 'active' : ''}>
            Websites
          </button>
        </div>
      </div>

      <div className="resources-list">
        {filteredResources.map((resource) => (
          <div className="resource-card" key={resource.id}>
            {resource.type === 'video' ? (
              <a href={resource.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <img src={resource.thumbnail} alt={resource.title} />
                <div className="resource-info">
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <span className="resource-meta">
                    <Video size={14} /> {resource.channel} • {resource.duration}
                  </span>
                </div>
              </a>
            ) : (
              <a href={resource.websiteUrl} target="_blank" rel="noopener noreferrer">
                <div className="resource-info">
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <span className="resource-meta">
                    <ExternalLink size={14} /> Website
                  </span>
                </div>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
