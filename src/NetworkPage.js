import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIsMobile } from './useIsMobile';
import VeniarNav from './VeniarNav';
import VeniarFooter from './VeniarFooter';

const CYAN = 'var(--rosso)';
const LAGOON = 'var(--rosso)';

export default function NetworkPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroBg = '#0E0D0C';

  useEffect(() => {
    document.title = 'Network — Veniar';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--vn-bg, var(--rn-bg))',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <VeniarNav />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          style={{
            background: heroBg,
            maxWidth: '100%',
            paddingTop: isMobile ? 120 : 160,
            paddingBottom: isMobile ? 72 : 100,
          }}
        >
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 8%' }}>
          {/* Gold eyebrow */}
          <p style={s.eyebrow}>NETWORK</p>

          {/* H1 */}
          <h1 style={{ ...s.h1, fontSize: isMobile ? '2.8rem' : '4.8rem', color: '#FFF8EA' }}>
            The Veniar network.
          </h1>

          {/* Gold accent bar */}
          <div style={{ ...s.goldBar, background: 'rgba(255,248,234,0.30)' }} />

          {/* Body */}
          <p style={{ ...s.body, color: 'rgba(255,248,234,0.68)' }}>
            The <em>Veniar</em> network is a group of independent local businesses that
            share a single rewards system. When you earn points at one location, you can
            spend them at any other location in the network.
          </p>
          </div>
        </section>

        {/* ── Info + CTA ───────────────────────────────────────────────── */}
        <section
          style={{
            background: 'var(--vn-panel, #F7E8CF)',
            padding: isMobile ? '48px 0 80px' : '64px 0 100px',
          }}
        >
          <div
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              padding: isMobile ? '0 24px' : '0 8%',
            }}
          >
            <p style={s.body}>
              Currently Building... Check back in for a full partner directory and
              interactive map. Any questions,{' '}
              <Link to="/contact" style={s.link}>
                contact support
              </Link>
              .
            </p>

            {/* CTA */}
            <div style={{ marginTop: '40px' }}>
              <button
                className="vn-cta-primary"
                style={s.btnPrimary}
                onClick={() => navigate('/map')}
              >
                View the map
              </button>
            </div>
          </div>
        </section>
      </main>

      <VeniarFooter />
    </div>
  );
}

const s = {
  eyebrow: {
    color: 'var(--vn-text)',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    margin: '0 0 20px',
  },
  h1: {
    color: 'var(--vn-text, var(--rn-text))',
    fontWeight: '900',
    lineHeight: 1.06,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontFamily: "'Archivo','Inter',sans-serif",
    margin: '0 0 24px',
  },
  goldBar: {
    width: '48px',
    height: '1px',
    background: 'var(--vn-line, var(--vn-card-border))',
    borderRadius: 0,
    marginBottom: '28px',
  },
  body: {
    color: 'var(--vn-text-sub, var(--rn-text-sub))',
    fontSize: '17px',
    lineHeight: 1.75,
    margin: '0 0 20px',
  },
  link: {
    color: CYAN,
    fontWeight: '600',
    textDecoration: 'none',
  },
  btnPrimary: {
    padding: '13px 26px',
    background: LAGOON,
    border: 'none',
    color: '#FFFFFF',
    borderRadius: 0,
    fontSize: '15px',
    fontWeight: '700',
    fontFamily: 'inherit',
  },
};
