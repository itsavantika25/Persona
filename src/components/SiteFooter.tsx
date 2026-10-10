import { Link } from 'react-router-dom';
import './SiteFooter.css';

export default function SiteFooter() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-main">
          <Link to="/" className="footer-logo">Persona</Link>
          <p className="footer-tagline">
            Multi-vector personality assessment. For self-reflection and personal insight.
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/assessment" className="footer-link">Take Test</Link>
          <Link to="/results" className="footer-link">My Results</Link>
          <Link to="/privacy" className="footer-link">Privacy</Link>
          <Link to="/terms" className="footer-link">Terms</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Persona. All rights reserved.</span>
      </div>
    </footer>
  );
}
