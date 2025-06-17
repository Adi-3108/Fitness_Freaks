"use client"
import React, { useState } from 'react'

export default function Footer() {
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [contactStatus, setContactStatus] = useState('')
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const trackFooterAction = async (action: string, target: string) => {
    try {
      await fetch('http://localhost:8080/api/footer-analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          target,
          userIp: 'client-side', // In production, get real IP
          userAgent: navigator.userAgent,
          pageUrl: window.location.href
        })
      })
    } catch (error) {
      console.error('Failed to track footer action:', error)
    }
  }

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    let isValid = true

    // Name validation
    if (!contactForm.name.trim()) {
      errors.name = 'Name is required'
      isValid = false
    } else if (contactForm.name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!contactForm.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!emailRegex.test(contactForm.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    // Subject validation
    if (!contactForm.subject.trim()) {
      errors.subject = 'Subject is required'
      isValid = false
    } else if (contactForm.subject.length < 5) {
      errors.subject = 'Subject must be at least 5 characters'
      isValid = false
    }

    // Message validation
    if (!contactForm.message.trim()) {
      errors.message = 'Message is required'
      isValid = false
    } else if (contactForm.message.length < 10) {
      errors.message = 'Message must be at least 10 characters'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setContactStatus('Please fix the errors in the form')
      return
    }

    setContactStatus('Sending...')
    
    try {
      const response = await fetch('http://localhost:8080/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setContactStatus('Message sent successfully!')
        setContactForm({ name: '', email: '', subject: '', message: '' })
        setFormErrors({ name: '', email: '', subject: '', message: '' })
        setShowContactForm(false)
        trackFooterAction('contact_form', 'contact')
      } else {
        setContactStatus(data.message || 'Failed to send message')
      }
    } catch (error) {
      setContactStatus('Error sending message. Please try again.')
      console.error('Contact form submission error:', error)
    }
  }

  const handleFormClose = () => {
    setShowContactForm(false)
    setContactForm({ name: '', email: '', subject: '', message: '' })
    setFormErrors({ name: '', email: '', subject: '', message: '' })
    setContactStatus('')
  }

  const handleSocialClick = (platform: string) => {
    trackFooterAction('social_click', platform)
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Contact Form */}
        <div className="contact-section">
          <h3>Get in Touch</h3>
          <p style={{fontSize:18 }}>Have questions? We'd love to hear from you!</p>
          <button 
            onClick={() => showContactForm ? handleFormClose() : setShowContactForm(true)}
            className="contact-toggle-btn"
          >
            {showContactForm ? 'Hide Contact Form' : 'Contact Us'}
          </button>
          
          {showContactForm && (
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => {
                      setContactForm({...contactForm, name: e.target.value})
                      setFormErrors({...formErrors, name: ''})
                    }}
                    className={formErrors.name ? 'error' : ''}
                  />
                  {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => {
                      setContactForm({...contactForm, email: e.target.value})
                      setFormErrors({...formErrors, email: ''})
                    }}
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Subject"
                  value={contactForm.subject}
                  onChange={(e) => {
                    setContactForm({...contactForm, subject: e.target.value})
                    setFormErrors({...formErrors, subject: ''})
                  }}
                  className={formErrors.subject ? 'error' : ''}
                />
                {formErrors.subject && <span className="error-message">{formErrors.subject}</span>}
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => {
                    setContactForm({...contactForm, message: e.target.value})
                    setFormErrors({...formErrors, message: ''})
                  }}
                  className={formErrors.message ? 'error' : ''}
                  rows={4}
                />
                {formErrors.message && <span className="error-message">{formErrors.message}</span>}
              </div>
              <button type="submit" disabled={contactStatus === 'Sending...'}>
                {contactStatus === 'Sending...' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
          {contactStatus && (
            <div className={`status-message ${contactStatus.includes('successfully') ? 'success' : 'error'}`}>
              {contactStatus}
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="about-section">
          <h3>About Fitness Freaks</h3>
          <p style={{fontSize:18 }}>Your ultimate destination for fitness excellence. We're dedicated to helping you achieve your health and wellness goals through personalized training, expert guidance, and a supportive community.</p>
          <div className="features">
            <div className="feature">
              <span className="feature-icon">💪</span>
              <span style={{fontSize:18 }}>Personal Training</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🥗</span>
              <span style={{fontSize:18 }}>Nutrition Plans</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🏋️‍♂️</span>
              <span style={{fontSize:18 }}>Workout Programs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="social">
        <a 
          href="https://www.facebook.com/iiitlucknow?mibextid=ZbWKwL" 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={() => handleSocialClick('facebook')}
        >
          <i className="bx bxl-facebook"></i>
        </a>
        <a
          href="https://www.instagram.com/iiitlucknow?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleSocialClick('instagram')}
        >
          <i className="bx bxl-instagram"></i>
        </a>
        <a 
          href="https://in.linkedin.com/school/iiitl/" 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={() => handleSocialClick('linkedin')}
        >
          <i className="bx bxl-linkedin"></i>
        </a>
      </div>

      <p className="copyright">&copy; Fitness Freaks {new Date().getFullYear()}-All Rights Reserved</p>

      <style jsx>{`
        .footer {
          position: relative;
          bottom: 0;
          width: 100%;
          padding: 40px 20px 20px;
          color: var(--main-color);
          text-align: center;
          background: var(--snd-bg-color);
          border-top: 2px solid var(--main-color);
          margin-top: auto;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 2rem;
          padding: 0 20px;
        }

        .contact-section,
        .about-section {
          text-align: left;
          background: rgba(255, 255, 255, 0.05);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid rgba(235, 235, 75, 0.2);
          backdrop-filter: blur(10px);
        }

        .contact-section h3,
        .about-section h3 {
          color: var(--main-color);
          font-size: 1.8rem;
          margin-bottom: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .contact-section p,
        .about-section p {
          color: var(--text-color);
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid rgba(235, 235, 75, 0.2);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .contact-form input,
        .contact-form textarea {
          padding: 1.2rem 1.5rem;
          border: 2px solid rgba(235, 235, 75, 0.3);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
          width: 100%;
        }

        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: rgba(255, 255, 255, 0.7);
          font-style: normal;
          font-size: 1rem;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: var(--main-color);
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 20px rgba(235, 235, 75, 0.3);
          transform: translateY(-2px);
        }

        .contact-form textarea {
          resize: vertical;
          min-height: 150px;
          font-family: inherit;
          line-height: 1.6;
        }

        .error-message {
          color: #ff6b6b;
          font-size: 0.9rem;
          margin-top: 0.3rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .error-message::before {
          content: "⚠️";
          font-size: 1rem;
        }

        .contact-form input.error,
        .contact-form textarea.error {
          border-color: #ff6b6b;
          background: rgba(255, 107, 107, 0.1);
        }

        .contact-form button {
          background: linear-gradient(135deg, var(--main-color) 0%, #dcdc3f 100%);
          color: #000;
          border: none;
          padding: 1.2rem 2.5rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(235, 235, 75, 0.3);
          margin-top: 1rem;
          width: 100%;
        }

        .contact-form button:hover {
          background: linear-gradient(135deg, #dcdc3f 0%, var(--main-color) 100%);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(235, 235, 75, 0.5);
        }

        .contact-form button:active {
          transform: translateY(-1px);
        }

        .contact-form button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .status-message {
          padding: 1.2rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1.1rem;
          text-align: center;
          margin-top: 1.5rem;
          border: 2px solid;
        }

        .status-message.success {
          background: rgba(76, 175, 80, 0.15);
          color: #4caf50;
          border-color: #4caf50;
        }

        .status-message.error {
          background: rgba(244, 67, 54, 0.15);
          color: #f44336;
          border-color: #f44336;
        }

        .contact-toggle-btn {
          background: linear-gradient(135deg, var(--main-color) 0%, #dcdc3f 100%);
          color: #000;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(235, 235, 75, 0.3);
          margin-bottom: 1.5rem;
        }

        .contact-toggle-btn:hover {
          background: linear-gradient(135deg, #dcdc3f 0%, var(--main-color) 100%);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(235, 235, 75, 0.5);
        }

        .contact-toggle-btn:active {
          transform: translateY(-1px);
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: var(--text-color);
          font-size: 1rem;
        }

        .feature-icon {
          font-size: 1.5rem;
          background: rgba(235, 235, 75, 0.2);
          padding: 0.5rem;
          border-radius: 8px;
          min-width: 40px;
          text-align: center;
        }

        .social {
          margin: 2rem 0;
          padding: 2rem 0;
          border-top: 1px solid rgba(235, 235, 75, 0.2);
          border-bottom: 1px solid rgba(235, 235, 75, 0.2);
        }

        .social a {
          font-size: 28px;
          color: var(--main-color);
          border: 2px solid var(--main-color);
          width: 50px;
          height: 50px;
          line-height: 50px;
          display: inline-block;
          text-align: center;
          border-radius: 50%;
          margin: 0 15px;
          transition: all 0.4s ease;
          background: rgba(235, 235, 75, 0.1);
        }

        .social a:hover {
          transform: scale(1.2) translateY(-10px);
          background: var(--main-color);
          color: #000;
          box-shadow: 0 0 30px var(--main-color);
        }

        .copyright {
          margin-top: 2rem;
          text-align: center;
          font-size: 1.1rem;
          color: var(--text-color);
          opacity: 0.8;
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .footer-content {
            gap: 2rem;
            padding: 0 15px;
          }
        }

        @media (max-width: 768px) {
          .footer {
            padding: 30px 15px 15px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 0 10px;
          }

          .contact-section,
          .about-section {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }

          .contact-section h3,
          .about-section h3 {
            font-size: 1.5rem;
          }

          .contact-section p,
          .about-section p {
            font-size: 1rem;
          }

          .contact-form input,
          .contact-form textarea {
            padding: 0.8rem 1rem;
            font-size: 0.95rem;
          }

          .contact-form button,
          .contact-toggle-btn {
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
          }

          .social a {
            font-size: 24px;
            width: 45px;
            height: 45px;
            line-height: 45px;
            margin: 0 10px;
          }
        }

        @media (max-width: 480px) {
          .footer {
            padding: 20px 10px 10px;
          }

          .contact-section,
          .about-section {
            padding: 1rem;
          }

          .contact-section h3,
          .about-section h3 {
            font-size: 1.3rem;
          }

          .contact-form input,
          .contact-form textarea {
            padding: 0.7rem 0.8rem;
            font-size: 0.9rem;
          }

          .contact-form button,
          .contact-toggle-btn {
            padding: 0.7rem 1.2rem;
            font-size: 0.9rem;
          }

          .social a {
            font-size: 20px;
            width: 40px;
            height: 40px;
            line-height: 40px;
            margin: 0 8px;
          }

          .copyright {
            font-size: 1rem;
          }
        }
      `}</style>
    </footer>
  )
}
