import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from './useIsMobile';
import VeniarNav from './VeniarNav';
import VeniarFooter from './VeniarFooter';

const CYAN = 'var(--rosso)';
const LAGOON = 'var(--rosso)';
const ORANGE = 'var(--rosso)';

const NUM_COLORS = [
  { bg: 'var(--vn-surface)',  color: CYAN },
  { bg: 'var(--vn-surface)',  color: LAGOON },
  { bg: 'var(--vn-surface)',   color: ORANGE },
];

const FEATURES = [
  {
    num: '01',
    heading: 'Real-time activity.',
    body: 'See every point issuance and redemption as it happens. Filter by date, employee, or customer.',
  },
  {
    num: '02',
    heading: 'Employee management.',
    body: 'Add staff accounts so your team can issue and redeem points at checkout without sharing owner credentials.',
  },
  {
    num: '03',
    heading: 'Point rate control.',
    body: (
      <>
        Set how many <em>Veniar</em> Points customers earn per dollar spent at your
        location.
      </>
    ),
  },
];

export default function MerchantDashboardPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroBg = '#0E0D0C';

  useEffect(() => {
    document.title = 'Merchant Dashboard — Veniar';
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
          <p style={s.eyebrow}>BUSINESSES</p>

          {/* H1 */}
          <h1 style={{ ...s.h1, fontSize: isMobile ? '2.8rem' : '4.8rem', color: '#FFF8EA' }}>
            The merchant dashboard.
          </h1>

          {/* Gold accent bar */}
          <div style={{ ...s.goldBar, background: 'rgba(255,248,234,0.30)' }} />

          {/* Intro body copy */}
          <p style={{ ...s.introPara, color: 'rgba(255,248,234,0.68)' }}>
            Every <em>Veniar</em> partner gets access to a real-time dashboard to manage
            their loyalty program.
          </p>
          </div>
        </section>

        {/* ── Feature blocks ───────────────────────────────────────────── */}
        <section
          style={{
            background: 'var(--vn-panel, #F7E8CF)',
            padding: isMobile ? '48px 0 64px' : '64px 0 80px',
          }}
        >
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: isMobile ? '0 24px' : '0 8%',
            display: 'flex',
            flexDirection: 'column',
            gap: '48px',
          }}
        >
          {FEATURES.map((f, i) => {
            const nc = NUM_COLORS[i % NUM_COLORS.length];
            return (
            <div key={f.num} style={s.featureBlock}>
              {/* Number badge — alternating color */}
              <span style={{ ...s.numBadge, background: nc.bg, color: nc.color }}>{f.num}</span>

              {/* Feature heading */}
              <h2
                style={{
                  ...s.featureHeading,
                  fontSize: isMobile ? '1.3rem' : '1.55rem',
                }}
              >
                {f.heading}
              </h2>

              {/* Feature body */}
              <p style={s.featureBody}>{f.body}</p>
            </div>
            );
          })}
        </div>
        </section>

        {/* ── CTA section ──────────────────────────────────────────────── */}
        <section
          style={{
            background: 'var(--vn-section-alt, #F5F5F4)',
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
          <div
            className="vn-card"
            style={{
              background: 'var(--vn-card, #FFFFFF)',
              borderRadius: 0,
              padding: isMobile ? '32px 24px' : '44px 40px',
            }}
          >
            <h2
              style={{
                color: 'var(--vn-text, var(--rn-text))',
                fontSize: isMobile ? '1.4rem' : '1.75rem',
                fontWeight: '800',
                letterSpacing: '0.02em',
                lineHeight: 1.2,
                margin: '0 0 28px',
              }}
            >
              Interested in joining the network?
            </h2>

            <button
              className="vn-cta-primary"
              style={s.btnPrimary}
              onClick={() => navigate('/business-overview')}
            >
              Apply to partner
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
  introPara: {
    color: 'var(--vn-text-sub, var(--rn-text-sub))',
    fontSize: '17px',
    lineHeight: 1.75,
    margin: 0,
  },
  featureBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  numBadge: {
    display: 'inline-block',
    alignSelf: 'flex-start',
    background: 'var(--vn-surface)',
    color: CYAN,
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '2px',
    padding: '4px 10px',
    borderRadius: 0,
    marginBottom: '4px',
  },
  featureHeading: {
    color: 'var(--vn-text, var(--rn-text))',
    fontWeight: '800',
    letterSpacing: '0.02em',
    lineHeight: 1.2,
    margin: 0,
  },
  featureBody: {
    color: 'var(--vn-text-sub, var(--rn-text-sub))',
    fontSize: '17px',
    lineHeight: 1.75,
    margin: 0,
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
