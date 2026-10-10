import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadCookieChoice, saveCookieChoice } from '../storage';
import './CookieBanner.css';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loadCookieChoice()) setVisible(true);
    (window as any).__reopenCookieBanner = () => setVisible(true);
  }, []);

  function accept() { saveCookieChoice('accepted'); setVisible(false); }
  function decline() { saveCookieChoice('declined'); setVisible(false); }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie preferences" aria-live="polite">
      <p className="cookie-text">
        This site uses strictly necessary browser storage to save your quiz progress and results.
        No tracking, no analytics, nothing goes to a server.{' '}
        <Link to="/privacy">Privacy policy</Link>.
      </p>
      <div className="cookie-actions">
        <button className="btn btn-lime btn-sm" onClick={accept} id="cookie-accept">Accept</button>
        <button className="btn btn-white btn-sm" onClick={decline} id="cookie-decline">Decline</button>
      </div>
    </div>
  );
}
