import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadResults } from '../storage';

export default function SiteNav({ startHref = '/assessment' }: { startHref?: string }) {
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    const r = loadResults();
    if (r) setHasResults(true);
  }, []);

  return (
    <nav className="nav" aria-label="Main navigation">
      <Link to="/" className="nav-logo" aria-label="Persona — go to home">Persona</Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {hasResults && (
          <Link to="/results" className="btn btn-white btn-sm" id="nav-results-btn">
            My Results
          </Link>
        )}
        <Link to={startHref} className="btn btn-lime btn-sm" id="nav-start-btn">
          Start Test
        </Link>
      </div>
    </nav>
  );
}
