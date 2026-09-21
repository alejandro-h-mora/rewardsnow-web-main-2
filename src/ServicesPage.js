import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from './useIsMobile';
import VeniarNav from './VeniarNav';
import VeniarFooter from './VeniarFooter';

const SERVICES = [
  {
    title: 'Shared Rewards Network',
    desc: 'Customers earn points at any partner location. Points are pooled across the entire network — not siloed per business.',
    badge: 'Network',
  },
  {
    title: 'Merchant Dashboard',
    desc: 'Business owners get a real-time dashboard to manage redemptions, view customer activity, and configure point rates.',
    badge: 'Dashboard',
  },
  {
    title: 'Employee Checkout Tools',
    desc: 'Staff look up customers by phone number and issue points or process redemptions in seconds — right from the counter.',
    badge: 'Checkout',
  },
  {
    title: 'Customer App',
    desc: 'Customers track their balance, browse partner locations, and view full transaction history on web or mobile.',
    badge: 'App',
  },
  {
    title: 'Network Map',
    desc: 'A live map showing every active partner location where customers can earn or redeem — updated in real time.',
    badge: 'Map',
  },
  {
    title: 'Onboarding & Support',
    desc: 'RewardsNow handles setup, training, and ongoing support for every partner business — no technical work required.',
    badge: 'Support',
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroBg = '#0E0D0C';

  useEffect(() => {
    document.title = 'Services — Veniar';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--vn-bg)',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <VeniarNav />

      <main>
        {/* Header */}
        <section
          style={{
            background: heroBg,
            maxWidth: '100%',
            paddingTop: isMobile ? 120 : 160,
            paddingBottom: isMobile ? 72 : 100,
          }}
        >
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 8%' }}>
          <p style={s.eyebrow}>SERVICES</p>
          <h1 style={{ ...s.h1, fontSize: isMobile ? '2.8rem' : '4.8rem', color: '#FFF8EA' }}>
            What Veniar offers.
          </h1>
          <div style={{ ...s.accentBar, background: 'rgba(255,248,234,0.30)' }} />
          <p style={{ ...s.lead, maxWidth: '520px', color: 'rgba(255,248,234,0.68)' }}>
            A complete shared-loyalty infrastructure — one network, every partner, zero friction.
          </p>
          </div>
        </section>

        {/* Service cards */}
        <section
          style={{
            background: 'var(--vn-panel, #F7E8CF)',
            padding: isMobile ? '48px 0 120px' : '64px 0 140px',
          }}
        >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: isMobile ? '0 24px' : '0 8%',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: isMobile ? '24px' : '32px',
            }}
          >
            {SERVICES.map((svc) => (
              <div
                key={svc.title}
                className="vn-card"
                style={{
                  background: 'var(--vn-card)',
                  borderRadius: 0,
                  borderTop: '1px solid var(--vn-line, var(--vn-card-border))',
                  padding: isMobile ? '32px 24px' : '44px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    background: 'var(--vn-surface)',
                    color: 'var(--vn-text-sub)',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    padding: '5px 12px',
                    borderRadius: 0,
                  }}
                >
                  {svc.badge}
                </span>

                <p
                  style={{
                    color: 'var(--vn-text)',
                    fontSize: '18px',
                    fontWeight: '800',
                    letterSpacing: '0.02em',
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {svc.title}
                </p>

                <p
                  style={{
                    color: 'var(--vn-text-sub)',
                    fontSize: '15px',
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {svc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        </section>

        {/* Closing CTA */}
        <section
          style={{
            background: 'var(--vn-bg)',
            padding: isMobile ? '64px 24px' : '96px 8%',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ ...s.h1, fontSize: isMobile ? '1.8rem' : '2.6rem', margin: '0 0 16px' }}>
              Ready to get started?
            </h2>
            <p style={{ ...s.lead, margin: '0 auto 32px' }}>
              Join as a customer to start earning, or apply to bring your business into the network.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="vn2-btn vn2-btn-primary"
                onClick={() => navigate('/join')}
              >
                Join Veniar
              </button>
              <button
                className="vn2-btn vn2-btn-outline"
                onClick={() => navigate('/business-overview')}
              >
                For business owners
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
    margin: '0 0 24px',
    opacity: 0.72,
  },
  h1: {
    color: 'var(--vn-text)',
    fontWeight: '800',
    lineHeight: 1.1,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontFamily: "'Archivo','Inter',sans-serif",
    margin: '0 0 28px',
  },
  accentBar: {
    width: '48px',
    height: '1px',
    background: 'var(--vn-line, var(--vn-card-border))',
    borderRadius: 0,
    marginBottom: '32px',
  },
  lead: {
    color: 'var(--vn-text-sub)',
    fontSize: '18px',
    lineHeight: 1.65,
    margin: 0,
  },
};
