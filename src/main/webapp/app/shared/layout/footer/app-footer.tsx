import React from 'react';
import { Link } from 'react-router-dom';
import './app-footer.scss';

interface FooterLink {
  label: string;
  path: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface AppFooterProps {
  sections?: FooterSection[];
  showSocial?: boolean;
  showLogo?: boolean;
}

const DEFAULT_SECTIONS: FooterSection[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
    ],
  },
  {
    title: 'Contact Us',
    links: [
      { label: 'support@langleague.edu', path: 'mailto:support@langleague.edu' },
      { label: '+1 (555) 123-4567', path: 'tel:+15551234567' },
    ],
  },
];

export const AppFooter: React.FC<AppFooterProps> = ({ sections = DEFAULT_SECTIONS, showSocial = true, showLogo = true }) => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        {showLogo && (
          <div className="footer-logo">
            <div className="logo-icon">
              <i className="bi bi-book"></i>
            </div>
            <span>Langleague</span>
          </div>
        )}

        <div className="footer-links">
          {sections.map((section, index) => (
            <div key={index} className="footer-section">
              <h4>{section.title}</h4>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.path.startsWith('http') || link.path.startsWith('mailto') || link.path.startsWith('tel') ? (
                      <a href={link.path} target={link.path.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.path}>{link.label}</Link>
                    )}
                  </li>
                ))}
                {section.title === 'Contact Us' && showSocial && (
                  <li>
                    <div className="social-icons">
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-tiktok"></i>
                      </a>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Langleague. All rights reserved.</p>
      </div>
    </footer>
  );
};
