import React, { useState } from 'react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: '',
    message: '',
    rating: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Thank you for your feedback!');
    // Reset form
    setFormData({
      name: '',
      email: '',
      feedbackType: '',
      message: '',
      rating: ''
    });
  };

  return (
    <section id="feedback" className="feedback-section">
      <div className="section-container">
        <div className="section-header">
          <h2>Your Feedback Matters</h2>
          <p>Help us improve your resume building experience</p>
        </div>
        
        <div className="feedback-content">
          <div className="feedback-form-container">
            <form id="feedbackForm" className="feedback-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="feedbackType">Feedback Type</label>
                <select 
                  id="feedbackType" 
                  name="feedbackType"
                  value={formData.feedbackType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select feedback type</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="bug">Bug Report</option>
                  <option value="compliment">Compliment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Feedback</label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5" 
                  placeholder="Please share your thoughts with us" 
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="rating">Your Rating</label>
                <div className="star-input">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <>
                      <input
                        key={star}
                        type="radio"
                        id={`star${star}`}
                        name="rating"
                        value={star}
                        checked={formData.rating === `${star}`}
                        onChange={handleChange}
                      />
                      <label htmlFor={`star${star}`} title={`${star} stars`}>
                        <i className="fas fa-star"></i>
                      </label>
                    </>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <button type="submit" className="btn-submit">Submit Feedback</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;
