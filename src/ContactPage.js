import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from './useIsMobile';
import VeniarNav from './VeniarNav';
import VeniarFooter from './VeniarFooter';

const CYAN = 'var(--rosso)';
const LAGOON = 'var(--rosso)';
const ORANGE = 'var(--rosso)';
const MUTED  = '#5F6B73';

const ROW_ACCENTS = [CYAN, LAGOON, ORANGE];

export default function ContactPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroBg = '#0E0D0C';

  useEffect(() => {
    document.title = 'Contact — Veniar';
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
        {/* ── Hero + contact rows ───────────────────────────────────────── */}
        <section
          style={{
            background: heroBg,
            maxWidth: '100%',
            paddingTop: isMobile ? 120 : 160,
            paddingBottom: isMobile ? 72 : 100,
          }}
        >
          <div style={{ maxWidth: '720px', padding: isMobile ? '0 24px' : '0 8%' }}>
          {/* Gold eyebrow */}
          <p style={s.eyebrow}>SUPPORT</p>

          {/* H1 */}
          <h1
            style={{
              ...s.h1,
              fontSize: isMobile ? '2.8rem' : '4.8rem',
              color: '#FFF8EA',
            }}
          >
            Contact Veniar.
          </h1>

          {/* Gold accent bar */}
          <div style={{ ...s.goldBar, background: 'rgba(255,248,234,0.30)' }} />

          {/* Contact info rows */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginBottom: '48px',
            }}
          >
            {[
              { label: 'For general questions and support:', email: 'hello@veniar.com', href: 'mailto:hello@veniar.com' },
              { label: 'For legal matters:', email: 'legal@rewards-now.net', href: 'mailto:legal@rewards-now.net' },
              { label: 'For business partnerships:', email: 'hello@veniar.com', href: 'mailto:hello@veniar.com' },
            ].map((row, i) => (
              <div
                key={row.label}
                style={{
                  ...s.contactRow,
                  borderLeft: `3px solid ${ROW_ACCENTS[i]}`,
                  paddingLeft: '14px',
                }}
              >
                <p style={s.contactLabel}>{row.label}</p>
                <a href={row.href} style={{ ...s.emailLink, color: ROW_ACCENTS[i] }}>
                  {row.email}
                </a>
              </div>
            ))}
          </div>

          {/* Response time note */}
          <p style={s.responseNote}>
            We respond within 1–2 business days.
          </p>
          </div>
        </section>

        {/* ── Self-service card ─────────────────────────────────────────── */}
        <section
          style={{
            background: 'var(--vn-panel, #F7E8CF)',
            padding: isMobile ? '48px 0 80px' : '64px 0 100px',
          }}
        >
          <div
            style={{
              maxWidth: '720px',
                            padding: isMobile ? '0 24px' : '0 8%',
            }}
          >
            {/* Self-service support card */}
            <div
              className="vn-card"
              style={{
                ...s.supportCard,
                padding: isMobile ? '24px 20px' : '28px 28px',
              }}
            >
              <p style={s.cardTitle}>Looking for self-service support?</p>
              <p style={s.cardDesc}>
                Browse our help topics for quick answers to common questions.
              </p>
              <button
                style={s.btnPrimary}
                onClick={() => navigate('/support')}
              >
                Browse support topics
              </button>
            </div>

            {/* Parent company note */}
            <p style={s.parentNote}>
              Veniar is a product of{' '}
              <a
                href="https://rewards-now.net"
                target="_blank"
                rel="noopener noreferrer"
                style={s.externalLink}
              >
                RewardsNow
              </a>
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
    marginBottom: '40px',
  },
  contactRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  contactLabel: {
    color: 'var(--vn-text-sub, var(--rn-text-sub))',
    fontSize: '15px',
    lineHeight: 1.5,
    margin: 0,
  },
  emailLink: {
    color: LAGOON,
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  responseNote: {
    color: MUTED,
    fontSize: '14px',
    lineHeight: 1.6,
    margin: 0,
  },
  supportCard: {
    background: 'var(--vn-card, #FFFFFF)',
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  cardTitle: {
    color: 'var(--vn-text, var(--rn-text))',
    fontSize: '16px',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '0.02em',
  },
  cardDesc: {
    color: MUTED,
    fontSize: '14px',
    lineHeight: 1.65,
    margin: '0 0 6px',
  },
  btnPrimary: {
    padding: '12px 24px',
    background: LAGOON,
    border: 'none',
    color: '#FFFFFF',
    borderRadius: 0,
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    alignSelf: 'flex-start',
  },
  parentNote: {
    color: MUTED,
    fontSize: '13px',
    marginTop: '32px',
  },
  externalLink: {
    color: LAGOON,
    fontWeight: '600',
    textDecoration: 'none',
  },
};
