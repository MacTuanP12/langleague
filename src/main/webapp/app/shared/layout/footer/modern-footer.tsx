import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import './modern-footer.scss';

// ============================================
// TypeScript Interfaces
// ============================================
interface ModernFooterProps {
  className?: string;
  variant?: 'default' | 'compact';
}

// ============================================
// Modern Footer Component - Glassmorphism Style
// ============================================
export const ModernFooter: React.FC<ModernFooterProps> = ({ className = '', variant = 'default' }) => {
  const currentYear = new Date().getFullYear();

  // Compact variant for pages with limited space
  if (variant === 'compact') {
    return (
      <footer className={`modern-footer-wrapper compact ${className}`}>
        <div className="footer-container">
          <p className="copyright">
            © {currentYear} LangLeague • Made with ❤️ • <Translate contentKey="global.footer.copyright">All rights reserved</Translate>
          </p>
        </div>
      </footer>
    );
  }

  // Full "Fat Footer" layout
  return (
    <footer className={`modern-footer-wrapper ${className}`}>
      <div className="footer-container">
        {/* Main Footer Content - 4 Columns */}
        <div className="footer-grid">
          {/* Column 1: Brand + Slogan */}
          <div className="footer-column brand-column">
            <div className="brand-section">
              <div className="brand-logo">
                <img src="content/images/1780b2f0-03c1-41b9-8974-d4277af11f79.jpg" alt="LangLeague Logo" className="brand-img" />
                <span className="brand-name">LangLeague</span>
              </div>
              <p className="brand-slogan">
                <Translate contentKey="global.footer.slogan">
                  Empowering language learners worldwide with modern, interactive learning experiences.
                </Translate>
              </p>
              <div className="brand-badges">
                <span className="badge">🎓 Learn</span>
                <span className="badge">🚀 Grow</span>
                <span className="badge">🌍 Connect</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h4 className="column-title">
              <i className="bi bi-link-45deg"></i>
              <Translate contentKey="global.footer.quickLinks.title">Quick Links</Translate>
            </h4>
            <ul className="footer-links">
              <li>
                <Link to="/">
                  <i className="bi bi-house-door"></i>
                  <Translate contentKey="global.footer.quickLinks.home">Home</Translate>
                </Link>
              </li>
              <li>
                <Link to="/student">
                  <i className="bi bi-mortarboard"></i>
                  <Translate contentKey="global.footer.quickLinks.books">Books</Translate>
                </Link>
              </li>
              <li>
                <Link to="/about">
                  <i className="bi bi-info-circle"></i>
                  <Translate contentKey="global.footer.quickLinks.about">About Us</Translate>
                </Link>
              </li>
              <li>
                <Link to="/help">
                  <i className="bi bi-question-circle"></i>
                  <Translate contentKey="global.footer.quickLinks.help">Help Center</Translate>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Legal */}
          <div className="footer-column">
            <h4 className="column-title">
              <i className="bi bi-file-text"></i>
              <Translate contentKey="global.footer.resources.title">Resources</Translate>
            </h4>
            <ul className="footer-links">
              <li>
                <Link to="/privacy">
                  <i className="bi bi-shield-check"></i>
                  <Translate contentKey="global.footer.legal.privacy">Privacy Policy</Translate>
                </Link>
              </li>
              <li>
                <Link to="/terms">
                  <i className="bi bi-file-earmark-text"></i>
                  <Translate contentKey="global.footer.legal.terms">Terms of Service</Translate>
                </Link>
              </li>
              <li>
                <Link to="/cookies">
                  <i className="bi bi-cookie"></i>
                  <Translate contentKey="global.footer.legal.cookies">Cookie Policy</Translate>
                </Link>
              </li>
              <li>
                <Link to="/faq">
                  <i className="bi bi-chat-left-dots"></i>
                  <Translate contentKey="global.footer.resources.faq">FAQ</Translate>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="footer-column contact-column">
            <h4 className="column-title">
              <i className="bi bi-chat-heart"></i>
              <Translate contentKey="global.footer.connect.title">Connect With Us</Translate>
            </h4>
            <div className="contact-info">
              <a href="mailto:support@langleague.com" className="contact-item">
                <i className="bi bi-envelope"></i>
                <span>support@langleague.com</span>
              </a>
              <a href="tel:+1234567890" className="contact-item">
                <i className="bi bi-telephone"></i>
                <span>+1 (234) 567-890</span>
              </a>
            </div>

            <div className="social-section">
              <p className="social-label">
                <Translate contentKey="global.footer.social.followUs">Follow us on social media</Translate>
              </p>
              <div className="social-links">
                <a
                  href="https://facebook.com/langleague"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  aria-label="Visit our Facebook page"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="https://twitter.com/langleague"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter"
                  aria-label="Visit our Twitter profile"
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <a
                  href="https://instagram.com/langleague"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  aria-label="Visit our Instagram profile"
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a
                  href="https://linkedin.com/company/langleague"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  aria-label="Visit our LinkedIn page"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
                <a
                  href="https://youtube.com/@langleague"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube"
                  aria-label="Visit our YouTube channel"
                >
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div className="footer-bottom">
          <div className="bottom-content">
            <p className="copyright">
              © {currentYear} LangLeague • <Translate contentKey="global.footer.copyright">All rights reserved</Translate>
            </p>
            <p className="made-with-love">
              <Translate contentKey="global.footer.madeWithLove">Made with</Translate> <i className="bi bi-heart-fill"></i>{' '}
              <Translate contentKey="global.footer.byTeam">by the LangLeague Team</Translate>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
