import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from './useIsMobile';
import VeniarNav from './VeniarNav';
import VeniarFooter from './VeniarFooter';

const LAGOON = 'var(--rosso)';
const ORANGE = 'var(--rosso)';
const MUTED  = '#5F6B73';

export default function PricingPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroBg = '#0E0D0C';

  useEffect(() => {
    document.title = 'Pricing — Veniar';
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
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 8%' }}>
          {/* Gold eyebrow */}
          <p style={s.eyebrow}>PRICING</p>

          {/* H1 */}
          <h1
            style={{
              ...s.h1,
              fontSize: isMobile ? '2.8rem' : '4.8rem',
              color: '#FFF8EA',
            }}
          >
            Pricing for independent businesses.
          </h1>

          {/* Gold accent bar */}
          <div style={{ ...s.goldBar, background: 'rgba(255,248,234,0.30)' }} />

          {/* Body copy */}
          <p style={{ ...s.body, color: 'rgba(255,248,234,0.68)' }}>
            Clear, direct pricing is coming soon. In the meantime, reach out to
            discuss your business needs and get early access details.
          </p>
          </div>
        </section>

        {/* ── CTA section ──────────────────────────────────────────────── */}
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
              textAlign: 'center',
            }}
          >
            {/* CTA buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                style={s.btnPrimary}
                onClick={() => navigate('/contact')}
              >
                Contact us
              </button>
              <button
                style={s.btnGhost}
                onClick={() => navigate('/join')}
              >
                Join Veniar
              </button>
            </div>

            {/* Status note */}
            <p style={s.mutedNote}>
              Currently Building... Check back in! Any questions,{' '}
              <button
                style={s.inlineLink}
                onClick={() => navigate('/contact')}
              >
                contact support
              </button>
              .
            </p>
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
    margin: '0 auto 28px',
  },
  body: {
    color: 'var(--vn-text-sub, var(--rn-text-sub))',
    fontSize: '17px',
    lineHeight: 1.75,
    margin: '0 auto',
    maxWidth: '540px',
  },
  btnPrimary: {
    padding: '14px 30px',
    background: ORANGE,
    border: 'none',
    color: '#FFFFFF',
    borderRadius: 0,
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  btnGhost: {
    padding: '13px 26px',
    background: 'transparent',
    border: '1.5px solid var(--vn-card-border, rgba(16,24,32,0.18))',
    color: 'var(--vn-text, var(--rn-text))',
    borderRadius: 0,
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  mutedNote: {
    color: MUTED,
    fontSize: '13px',
    marginTop: '36px',
    lineHeight: 1.6,
  },
  inlineLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: LAGOON,
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'underline',
  },
};
