import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import './TermsPage.css';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <SiteNav />

      <main className="legal-container">
        <header className="legal-header">
          
          <h1 className="headline legal-title">
            TERMS OF <span className="lime-word">SERVICE</span>
          </h1>
          <p className="legal-meta serif">
            Last updated: October 2026
          </p>
        </header>

        <div className="card legal-content-card">
          <section className="legal-section">
            <h2>1. Informational & Entertainment Purpose Only</h2>
            <p>
              PERSONA is a personality assessment tool designed solely for self-reflection, personal exploration, and entertainment purposes.
            </p>
            <div className="privacy-highlight-box" style={{ borderLeftColor: 'var(--magenta)' }}>
              <strong>Not a Psychological or Clinical Diagnosis</strong>
              <p>
                The outputs, archetypes, and dimension profiles provided by this tool do not constitute medical, psychiatric, psychological, or clinical diagnostic advice. Never use these results as a substitute for professional mental health counseling.
              </p>
            </div>
          </section>

          <section className="legal-section">
            <h2>2. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or completing the assessment on this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. If you disagree with any portion of these terms, please do not use the application.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Intellectual Property</h2>
            <p>
              All questions, archetypes, visual design tokens, graphic elements, and scoring models used on this website are protected by copyright and intellectual property laws. You may freely share screenshots or personal summaries of your own generated results for non-commercial purposes.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Limitation of Liability</h2>
            <p>
              PERSONA is provided on an "as-is" and "as-available" basis without any warranties of any kind, express or implied. Under no circumstances will the creators or operators be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this service.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Changes to These Terms</h2>
            <p>
              We reserve the right to revise or update these terms at our sole discretion. Any changes will be reflected on this page with an updated timestamp.
            </p>
          </section>

          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '2px dashed #1C1A1A', display: 'flex', gap: 16 }}>
            <Link to="/assessment" className="btn btn-lime btn-sm">Take the Assessment</Link>
            <Link to="/" className="btn btn-white btn-sm">Back to Home</Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
