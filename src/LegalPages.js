import { useEffect } from 'react';
import { useIsMobile } from './useIsMobile';
import VeniarNav from './VeniarNav';
import VeniarFooter from './VeniarFooter';

const PageShell = ({ title, updated, children }) => {
  const isMobile = useIsMobile();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--vn-bg)', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <VeniarNav />
      <main>
        <section style={{ background: '#0E0D0C', paddingTop: isMobile ? 120 : 160, paddingBottom: isMobile ? 56 : 80 }}>
          <div style={{ maxWidth: 720, padding: isMobile ? '0 24px' : '0 8%' }}>
            <p style={s.eyebrow}>LEGAL</p>
            <h1 style={{ ...s.h1, fontSize: isMobile ? '2.4rem' : '3.6rem' }}>{title}</h1>
            <div style={s.hairline} />
            <p style={s.updated}>Last updated: April 2026</p>
          </div>
        </section>
        <section style={{ background: 'var(--vn-panel, #F7E8CF)', padding: isMobile ? '48px 0 80px' : '64px 0 100px' }}>
          <div style={{ maxWidth: 720, padding: isMobile ? '0 24px' : '0 8%' }}>
            {children}
          </div>
        </section>
      </main>
      <VeniarFooter />
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={s.section}>
    <h2 style={s.sectionTitle}>{title}</h2>
    <p style={s.sectionBody}>{children}</p>
  </div>
);

export function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service — Veniar';
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageShell title="Terms of Service">
      <Section title="1. Acceptance of Terms">
        By creating a Veniar account or using our services, you agree to these Terms of Service. If you do not agree, do not use the service. Veniar is a product of RewardsNow, Inc.
      </Section>
      <Section title="2. Eligibility">
        You must be at least 13 years old to create a customer account. Business accounts require you to be a legal adult in your jurisdiction.
      </Section>
      <Section title="3. Veniar Points and Rewards">
        Veniar Points have no cash value and cannot be exchanged for currency, transferred between accounts, or redeemed outside of the approved Veniar merchant network. Points are promotional rewards earned through transactions at Veniar partner businesses and may be redeemed for rewards as described in each partner's service listing. We reserve the right to modify point values, redemption rates, and available rewards at any time.
      </Section>
      <Section title="4. Account Responsibility">
        You are responsible for all activity under your account. Keep your credentials secure. Notify us immediately at hello@veniar.com if you suspect unauthorized access.
      </Section>
      <Section title="5. Partner Businesses">
        Veniar is not responsible for the quality, safety, or availability of products or services offered by partner businesses. Disputes with partners should be resolved directly with the partner.
      </Section>
      <Section title="6. Termination">
        We may suspend or terminate accounts that violate these terms, engage in fraud, or abuse the Veniar Points system.
      </Section>
      <Section title="7. Changes to Terms">
        We may update these terms from time to time. Continued use of the service after changes constitutes acceptance.
      </Section>
      <Section title="8. Contact">
        Questions? Email us at hello@veniar.com. Legal matters: legal@rewards-now.net.
      </Section>
    </PageShell>
  );
}

export function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy — Veniar';
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageShell title="Privacy Policy">
      <Section title="1. What We Collect">
        We collect information you provide when creating an account (name, email, phone number, age), and transaction data generated when you earn or redeem Veniar Points at partner businesses.
      </Section>
      <Section title="2. How We Use It">
        We use your information to operate the Veniar service, send transaction notifications, process points, and improve the platform. We do not sell your personal information to third parties.
      </Section>
      <Section title="3. Sharing with Partners">
        When you transact at a partner business, that business receives confirmation of the transaction and your name. They do not receive your full account details.
      </Section>
      <Section title="4. Data Security">
        Passwords are stored as one-way cryptographic hashes. We use industry-standard security practices including encrypted connections for all data in transit.
      </Section>
      <Section title="5. Your Rights">
        You may request deletion of your account and associated data by emailing hello@veniar.com. We will process requests within 30 days.
      </Section>
      <Section title="6. Cookies">
        We use session tokens stored in browser memory to keep you signed in. We do not use tracking cookies or third-party advertising pixels.
      </Section>
      <Section title="7. Contact">
        For privacy questions, contact hello@veniar.com. Veniar is a product of RewardsNow, Inc.
      </Section>
    </PageShell>
  );
}

const s = {
  eyebrow: {
    color: '#FFF8EA',
    opacity: 0.85,
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    margin: '0 0 20px',
  },
  h1: {
    color: '#FFF8EA',
    fontWeight: 800,
    lineHeight: 1.06,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontFamily: "'Archivo','Inter',sans-serif",
    margin: '0 0 24px',
  },
  hairline: {
    width: '48px',
    height: '1px',
    background: 'rgba(255,248,234,0.30)',
    marginBottom: '20px',
  },
  updated: {
    color: 'rgba(255,248,234,0.55)',
    fontSize: '13px',
    margin: 0,
  },
  section: { marginBottom: '32px' },
  sectionTitle: {
    color: 'var(--vn-text)',
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '0.02em',
    margin: '0 0 8px',
  },
  sectionBody: {
    color: 'var(--vn-text-sub)',
    fontSize: '15px',
    lineHeight: 1.8,
    margin: 0,
  },
};
