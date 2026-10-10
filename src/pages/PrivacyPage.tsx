import { useState, useEffect } from 'react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import { clearQuizProgress, clearResults } from '../storage';
import './PrivacyPage.css';

export default function PrivacyPage() {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function handlePurgeData() {
    clearQuizProgress();
    clearResults();
    try {
      localStorage.clear();
    } catch {}
    setCleared(true);
    setTimeout(() => setCleared(false), 4000);
  }

  return (
    <div className="legal-page">
      <SiteNav />

      <main className="legal-container">
        <header className="legal-header">
         
          <h1 className="headline legal-title">
            PRIVACY <span className="lime-word">POLICY</span>
          </h1>
          <p className="legal-meta serif">
            Last updated: October 2026
          </p>
        </header>

        <div className="card legal-content-card">
          <div className="privacy-highlight-box">
            <strong>TL;DR: We don't collect your data because we don't have a backend.</strong>
            <p>
              Your quiz answers, scores, and archetype calculations are computed entirely inside your web browser. Nothing is transmitted to external servers, advertisers, or analytics trackers.
            </p>
          </div>

          <section className="legal-section">
            <h2>1. Architecture & Data Storage</h2>
            <p>
              PERSONA is built as a fully client-side single-page application. When you take the assessment, all state is processed in your device's memory and persisted solely to your browser's local storage (<code>localStorage</code>).
            </p>
            <p>The items stored in your browser include:</p>
            <ul>
              <li><strong>persona_answers:</strong> Your selected answers and rankings during the assessment.</li>
              <li><strong>persona_progress_idx:</strong> The index of the question you are currently answering (so you can resume if refreshed).</li>
              <li><strong>persona_results:</strong> The computed scores, archetype, and profile code generated at completion.</li>
              <li><strong>persona_cookie_choice:</strong> Your cookie banner acknowledgment state.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. No Analytics or Third-Party Tracking</h2>
            <p>
              We do not use Google Analytics, Meta Pixel, tracking cookies, or fingerprinting scripts. There are no advertising beacons or third-party behavioral profiling mechanisms embedded in this application.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Local Storage and Cookies</h2>
            <p>
              We only use necessary browser storage required for the essential functionality of the assessment (saving your progress and displaying your results). No tracking cookies are used.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Data Deletion & Your Control</h2>
            <p>
              Because your data never leaves your browser, you retain absolute control over it. You can clear your data at any time by clearing your browser cache/cookies, or by clicking the button below:
            </p>

            <div className="danger-zone-box">
              <div>
                <strong style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  Wipe All Local Quiz Data
                </strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-light)', marginTop: 4 }}>
                  This will permanently erase all stored answers, progress, and saved assessment results from this browser.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handlePurgeData}
                  className="btn btn-ink btn-sm"
                  id="wipe-local-data-btn"
                >
                  {cleared ? 'Local Data Cleared' : 'Purge Local Storage'}
                </button>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>5. Contact</h2>
            <p>
              If you have any questions regarding this Privacy Policy, you can reach out at <a href="mailto:persona@gmail.com" style={{ textDecoration: 'underline', fontWeight: 700 }}>persona@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
