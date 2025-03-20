import React from 'react';

const TemplateCard = ({ image, title }) => {
  return (
    <div className="template-card">
      <div className="template-image">
        <img src={image} alt={`Resume Template - ${title}`} />
        <div className="template-overlay">
          <button className="template-btn">Use Template</button>
        </div>
      </div>
      <h3>{title}</h3>
    </div>
  );
};

const TemplatesSection = () => {
  const templates = [
    { id: 1, image: '/img/pic1.png', title: 'Professional' },
    { id: 2, image: '/img/pic2.webp', title: 'Creative' },
    { id: 3, image: '/img/pic3.webp', title: 'Modern' },
    { id: 4, image: '/img/pic4.webp', title: 'Executive' },
    { id: 5, image: '/img/pic5.jpg', title: 'Simple' },
    { id: 6, image: '/img/pic6.jpg', title: 'Academic' }
  ];

  return (
    <section id="templates" className="templates-section">
      <div className="section-header">
        <h2>Templates</h2>
        <p>Choose from our professionally designed resume templates to get started</p>
      </div>
      
      <div className="templates-grid">
        {templates.map(template => (
          <TemplateCard 
            key={template.id}
            image={template.image}
            title={template.title}
          />
        ))}
      </div>
    </section>
  );
};

export default TemplatesSection;