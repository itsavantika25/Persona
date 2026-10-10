import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import './NotFoundPage.css';

export default function NotFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="notfound-page">
      <SiteNav />

      <main className="notfound-container">
        <div className="notfound-card">
          <div className="notfound-big-num">404</div>
          <h1 className="headline notfound-title">
            LOST IN THE <span className="lime-word">SPECTRUM</span>
          </h1>
          <p className="notfound-desc serif">
            The dimension you are looking for has recalibrated or doesn't exist in our personality matrix.
          </p>
          <div className="notfound-actions">
            <Link to="/" className="btn btn-lime btn-sm">
              ← Return Home
            </Link>
            <Link to="/assessment" className="btn btn-ink btn-sm">
              Start Assessment
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
