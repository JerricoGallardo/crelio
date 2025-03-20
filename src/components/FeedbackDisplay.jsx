import React from 'react';

const FeedbackItem = ({ name, rating, text, company }) => {
  // Helper function to render stars
  const renderStars = (count) => {
    const stars = [];
    const fullStars = Math.floor(count);
    const hasHalfStar = count % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half-star" className="fas fa-star-half-alt"></i>);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-star-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <div className="feedback-item">
      <div className="feedback-header">
        <h4>{name}</h4>
        <div className="star-rating">
          {renderStars(rating)}
        </div>
      </div>
      <p className="feedback-text">{text}</p>
      <div className="feedback-company">{company}</div>
    </div>
  );
};

const FeedbackDisplay = () => {
  const feedbacks = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      text: 'The templates are incredibly professional and helped me land an interview within a week of sending out my new resume.',
      company: 'Marketing Director'
    },
    {
      id: 2,
      name: 'Michael Chen',
      rating: 4,
      text: 'As a job seeker, it\'s important to have a tool that can help me create a professional resume. Crealio has been a lifesaver, allowing me to showcase my skills effectively.',
      company: 'Software Engineer'
    },
    {
      id: 3,
      name: 'Jasmine Santos',
      rating: 4.5,
      text: 'The resume builder has provided valuable insights into what employers look for and helped me make data-driven decisions about my career presentation. It\'s a game changer!',
      company: 'HR Consultant'
    }
  ];

  return (
    <section className="previous-feedback-wrapper">
      <div className="previous-feedback">
        <div className="section-heading">
          <h2>What Others Are Saying</h2>
          <p>Don't just take our word for it, see the success stories from users just like yours.</p>
        </div>
        
        <div className="feedback-container">
          {feedbacks.map(feedback => (
            <FeedbackItem
              key={feedback.id}
              name={feedback.name}
              rating={feedback.rating}
              text={feedback.text}
              company={feedback.company}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackDisplay;