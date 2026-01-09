import React from 'react';
import { Link } from 'react-router-dom';
import './modern-footer.scss';

interface ModernFooterProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export const ModernFooter: React.FC<ModernFooterProps> = ({ className = '', variant = 'default' }) => {
  const currentYear = new Date().getFullYear();

  if (variant === 'compact') {
    return (
      <footer className={`modern-footer compact ${className}`}>
        <div className="footer-content">
          <p className="copyright">© {currentYear} Langleague. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`modern-footer ${className}`}>
      <div className="footer-content">
        <div className="footer-section">
          <div className="brand-section">
            <div className="logo">
              <i className="bi bi-book"></i>
              <span>Langleague</span>
            </div>
            <p className="description">Your ultimate language learning platform</p>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="links">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/help">Help Center</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <div className="links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer" title="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" title="Twitter">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" title="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">© {currentYear} Langleague. All rights reserved.</p>
      </div>
    </footer>
  );
};
