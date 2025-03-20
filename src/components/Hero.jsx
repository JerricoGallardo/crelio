import React from 'react';

const Hero = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="welcome-section">
          <h1>Creating a Standout Resume <br /> That Highlights Your Skills and Experience</h1>
          <p>Learn how to create a compelling resume that effectively <br /> highlights your skills, experience, and achievements to stand out to employers.</p>
        </div>
        <div className="cta-container">
          <button className="btn-get-started">Get Started</button>
        </div>
      </div>
      
      <div className="hero-image">
        <img src="/img/72c0b2_29d445b883d24862a52bfe362f1d746f~mv2.webp" alt="Resume Builder Illustration" />
      </div>
    </div>
  );
};

export default Hero;