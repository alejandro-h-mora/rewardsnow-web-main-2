import { useEffect } from 'react';
import { useIsMobile } from './useIsMobile';
import VeniarNav from './VeniarNav';
import VeniarFooter from './VeniarFooter';

const LAGOON = 'var(--rosso)';
const PALM = 'var(--rosso)';
const MUTED  = '#5F6B73';

export default function CompanyPage() {
  const isMobile = useIsMobile();
  const heroBg = '#0E0D0C';

  useEffect(() => {
    document.title = 'RewardsNow — Parent Company';
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
          <div style={{ maxWidth: '720px', padding: isMobile ? '0 24px' : '0 8%' }}>
          {/* Gold eyebrow */}
          <p style={s.eyebrow}>COMPANY</p>

          {/* H1 */}
          <h1
            style={{
              ...s.h1,
              fontSize: isMobile ? '2.8rem' : '4.8rem',
              color: '#FFF8EA',
            }}
          >
            About RewardsNow.
          </h1>

          {/* Gold accent bar */}
          <div style={{ ...s.goldBar, background: 'rgba(255,248,234,0.30)' }} />

          {/* Body paragraphs */}
          <p style={{ ...s.body, color: 'rgba(255,248,234,0.68)' }}>
            RewardsNow is the parent company behind <em>Veniar</em>, a shared
            rewards platform for independent businesses and local commerce.
          </p>

          <p style={{ ...s.body, color: 'rgba(255,248,234,0.68)', marginTop: '20px' }}>
            <em>Veniar</em> is built, operated, and maintained by RewardsNow.
          </p>
          </div>
        </section>

        {/* ── Link card section ─────────────────────────────────────────── */}
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
            {/* External link card */}
            <div
              className="vn-card"
              style={{
                ...s.linkCard,
                borderTop: `3px solid ${PALM}`,
                padding: isMobile ? '24px 20px' : '28px 32px',
              }}
            >
              <p style={s.cardTitle}>RewardsNow</p>
              <p style={s.cardDesc}>
                Learn more about the company behind Veniar.
              </p>
              <a
                href="https://rewards-now.net"
                target="_blank"
                rel="noopener noreferrer"
                style={s.visitBtn}
              >
                Visit RewardsNow
              </a>
            </div>

            {/* Footer note */}
            <p style={s.footerNote}>
              Veniar is a product of RewardsNow.
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
    marginBottom: '32px',
  },
  body: {
    color: 'var(--vn-text-sub, var(--rn-text-sub))',
    fontSize: '17px',
    lineHeight: 1.75,
    margin: 0,
  },
  linkCard: {
    background: 'var(--vn-card, #FFFFFF)',
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  cardTitle: {
    color: 'var(--vn-text, var(--rn-text))',
    fontSize: '17px',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '0.02em',
  },
  cardDesc: {
    color: MUTED,
    fontSize: '14px',
    lineHeight: 1.65,
    margin: '0 0 4px',
  },
  visitBtn: {
    display: 'inline-block',
    padding: '13px 28px',
    background: LAGOON,
    color: '#FFFFFF',
    borderRadius: 0,
    fontSize: '15px',
    fontWeight: '700',
    textDecoration: 'none',
    alignSelf: 'flex-start',
  },
  footerNote: {
    color: MUTED,
    fontSize: '13px',
    marginTop: '32px',
  },
};
