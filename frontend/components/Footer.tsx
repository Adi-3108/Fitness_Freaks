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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        setShowContactForm(false)
        trackFooterAction('contact_form', 'contact')
      } else {
        setContactStatus(data.message || 'Failed to send message')
      }
    } catch (error) {
      setContactStatus('Error sending message. Please try again.')
    }
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
          <p>Have questions? We'd love to hear from you!</p>
          <button 
            onClick={() => setShowContactForm(!showContactForm)}
            className="contact-toggle-btn"
          >
            {showContactForm ? 'Hide Contact Form' : 'Contact Us'}
          </button>
          
          {showContactForm && (
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                required
              />
              <textarea
                placeholder="Your Message"
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                required
                rows={4}
              />
              <button type="submit">Send Message</button>
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
          <p>Your ultimate destination for fitness excellence. We're dedicated to helping you achieve your health and wellness goals through personalized training, expert guidance, and a supportive community.</p>
          <div className="features">
            <div className="feature">
              <span className="feature-icon">💪</span>
              <span>Personal Training</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🥗</span>
              <span>Nutrition Plans</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🏋️‍♂️</span>
              <span>Workout Programs</span>
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
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .contact-form input,
        .contact-form textarea {
          padding: 1rem 1.2rem;
          border: 2px solid rgba(235, 235, 75, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-color);
          font-size: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: var(--main-color);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 20px rgba(235, 235, 75, 0.3);
          transform: translateY(-2px);
        }

        .contact-form textarea {
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
          line-height: 1.6;
        }

        .contact-form button,
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
        }

        .contact-form button:hover,
        .contact-toggle-btn:hover {
          background: linear-gradient(135deg, #dcdc3f 0%, var(--main-color) 100%);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(235, 235, 75, 0.5);
        }

        .contact-form button:active,
        .contact-toggle-btn:active {
          transform: translateY(-1px);
        }

        .status-message {
          padding: 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          text-align: center;
          margin-top: 1rem;
          border: 1px solid;
        }

        .status-message.success {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          border-color: #4caf50;
        }

        .status-message.error {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
          border-color: #f44336;
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
