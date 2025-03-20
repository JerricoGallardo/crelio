import React from 'react';

const FeatureBox = ({ icon, title, description }) => {
  return (
    <div className="feature-box">
      <i className={icon}></i>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
};

const AboutSection = () => {
  const features = [
    {
      id: 1,
      icon: 'fas fa-file-alt',
      title: 'Professional Templates',
      description: 'Industry-tailored designs'
    },
    {
      id: 2,
      icon: 'fas fa-paint-brush',
      title: 'Easy Customization',
      description: 'Intuitive editing tools'
    },
    {
      id: 3,
      icon: 'fas fa-check-circle',
      title: 'ATS-Friendly',
      description: 'Pass automated screening'
    },
    {
      id: 4,
      icon: 'fas fa-lightbulb',
      title: 'Expert Guidance',
      description: 'Tips throughout the process'
    }
  ];

  return (
    <section id="about" className="about-section">
      <div className="section-container">
        <div className="section-header">
          <h2>About Crealio</h2>
          <p>Helping you stand out in the job market</p>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <div className="mission-box">
              <i className="fas fa-bullseye mission-icon"></i>
              <h3>Our Mission</h3>
              <p>We provide professional tools that help job seekers create standout resumes that catch employers' attention.</p>
            </div>
            
            <div className="features-container">
              {features.map(feature => (
                <FeatureBox
                  key={feature.id}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
          
          <div className="about-image">
            <img src="/img/about-image.jpg" alt="Team working on resume designs" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;