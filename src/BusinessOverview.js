import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from './useIsMobile';
import FadeInSection from './FadeInSection';
import VeniarNav from './VeniarNav';
import VeniarFooter from './VeniarFooter';

const EMPLOYEE_PORTAL_URL = process.env.REACT_APP_EMPLOYEE_PORTAL_URL || '/employee';
const EMPLOYEE_ROUTE = '/employee';

const WORKFLOW = [
  { n: '01', title: 'Submit business information', desc: 'Share basic details about your business so the team can review fit and next steps.' },
  { n: '02', title: 'Configure rewards and offers', desc: 'Set eligible offers, reward rules, and redemption options for your business.' },
  { n: '03', title: 'Use merchant tools', desc: 'Track redemptions, repeat visits, customer activity, referrals, and active offers.' },
  { n: '04', title: 'Participate in the network', desc: 'Become discoverable to customers using Veniar to find local businesses.' },
];

export default function BusinessOverview() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroBg = '#0E0D0C';

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={s.root}>

      <VeniarNav />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ ...s.hero, background: heroBg, padding: isMobile ? '120px 24px 72px' : '160px 8% 100px' }}>
        <div style={s.heroInner}>
        <FadeInSection>
        <p style={s.eyebrow}>FOR INDEPENDENT BUSINESSES</p>
        <h1 style={{ ...s.heroTitle, color: '#FFF8EA', fontSize: isMobile ? '2.8rem' : '4.8rem' }}>
          Shared rewards for customer retention and local discovery.
        </h1>
        <div style={{ ...s.goldBar, background: 'rgba(255,248,234,0.30)' }} />
        <p style={{ ...s.heroSub, color: 'rgba(255,248,234,0.68)', maxWidth: '680px' }}>
          <em>Veniar</em> gives independent businesses access to shared rewards, merchant-controlled offers, customer discovery, and reporting tools without requiring every business to build its own loyalty system from scratch.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button style={s.ctaPrimary} onClick={() => navigate('/business-register')}>Apply to join</button>
          <button style={{ ...s.ctaGhost, borderColor: 'rgba(255,248,234,0.38)', color: '#FFF8EA' }} onClick={() => navigate('/business-owner')}>Business sign in</button>
        </div>
        <p style={{ color: 'rgba(255,248,234,0.50)', fontSize: '14px', marginTop: '20px', marginBottom: 0 }}>Built for restaurants, cafés, shops, and local service businesses.</p>
        </FadeInSection>
        </div>
      </section>

      {/* ── Business case ─────────────────────────────────────────────────── */}
      <section style={{ ...s.section, padding: isMobile ? '56px 24px' : '80px 80px' }}>
        <FadeInSection><div style={s.contentMax}>
          <p style={s.tag}>THE BUSINESS CASE</p>
          <h2 style={{ ...s.h2, fontSize: isMobile ? '1.8rem' : '2.4rem' }}>Independent businesses should not have to build loyalty infrastructure alone.</h2>
          <div style={s.goldLine} />
          <p style={s.body}>
            Large chains often benefit from scale, customer data, loyalty infrastructure, and distribution. Independent businesses usually operate with smaller teams, tighter budgets, and fewer tools. <em>Veniar</em> is designed to make rewards and local discovery more accessible through a shared network.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', marginTop: '32px' }}>
            {[
              'Customer retention is often less expensive than customer acquisition.',
              'Standalone loyalty programs can be costly to design, launch, and operate.',
              'Independent businesses need practical tools for repeat visits, discovery, and clear reporting.',
              'A shared network can help customers discover participating businesses beyond the place where they first earned rewards.',
            ].map(point => (
              <div key={point} style={{ background: 'var(--vn-card, #FFFFFF)', borderRadius: 0, padding: '20px 22px', color: 'var(--vn-text-sub)', fontSize: '14px', lineHeight: 1.7 }}>
                {point}
              </div>
            ))}
          </div>
        </div></FadeInSection>
      </section>

      {/* ── The problem ────────────────────────────────────────────────── */}
      <section style={{ ...s.sectionAlt, padding: isMobile ? '56px 24px' : '80px 80px' }}>
        <FadeInSection><div style={s.contentMax}>
          <p style={s.tag}>THE PROBLEM</p>
          <h2 style={{ ...s.h2, fontSize: isMobile ? '1.8rem' : '2.4rem' }}>Most loyalty tools are built for businesses with more scale.</h2>
          <div style={s.goldLine} />
          <p style={s.body}>Traditional loyalty programs can be expensive to launch, difficult to operate, and limited to a single business. They may help retain existing customers, but they often do little to help independent businesses reach new local customers.</p>
          <div style={{ ...s.grid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', marginTop: '32px' }}>
            {[
              { problem: 'High setup and software costs', solution: 'Veniar provides shared rewards infrastructure so each business does not have to build a system alone.' },
              { problem: 'Limited customer discovery', solution: 'Participating businesses can be discovered inside the Veniar Network.' },
              { problem: 'Isolated loyalty programs', solution: 'Customers can earn and redeem eligible rewards across participating businesses.' },
              { problem: 'Hard-to-read results', solution: 'Merchant tools help businesses view redemptions, repeat visits, referrals, and offer activity.' },
              { problem: 'Operational complexity', solution: 'The product is designed around practical merchant workflows, simple transaction handling, and clear reporting.' },
            ].map(p => (
              <div key={p.problem} style={s.problemCard}>
                <p style={s.problem}>✗ {p.problem}</p>
                <p style={s.solution}>✓ {p.solution}</p>
              </div>
            ))}
          </div>
        </div></FadeInSection>
      </section>

      {/* ── How Veniar works for your business ───────────────────────────── */}
      <section style={{ ...s.section, padding: isMobile ? '56px 24px' : '80px 80px' }}>
        <FadeInSection><div style={s.contentMax}>
          <p style={s.tag}>HOW IT WORKS</p>
          <h2 style={{ ...s.h2, fontSize: isMobile ? '1.8rem' : '2.4rem' }}>Simple onboarding for participating businesses.</h2>
          <div style={s.goldLine} />
          <p style={s.body}>
            Businesses apply to join <em>Veniar</em>, configure eligible rewards and offers, and use merchant tools to manage customer activity. The goal is to make rewards practical for independent businesses without adding unnecessary operational burden.
          </p>
          <div style={{ ...s.workflowGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px', marginTop: '40px' }}>
            {WORKFLOW.map((step, i) => (
              <FadeInSection key={step.n} delay={i * 80} style={s.workflowCard}>
                <span style={s.workflowNum}>{step.n}</span>
                <p style={s.workflowTitle}>{step.title}</p>
                <p style={s.workflowDesc}>{step.desc}</p>
              </FadeInSection>
            ))}
          </div>

          <p style={{ color: 'var(--vn-text-sub)', fontSize: '13px', lineHeight: 1.7, marginTop: '24px', fontStyle: 'italic' }}>
            Applications are reviewed before onboarding. If accepted, the team will help your business understand setup, usage, and next steps.
          </p>

          {/* Employee portal callout inside workflow section */}
          <div style={{ ...s.empCallout, marginTop: '32px' }}>
            <div>
              <p style={s.empCalloutTitle}>Your employees need a separate sign-in</p>
              <p style={s.empCalloutDesc}>
                Staff use the Veniar employee portal — not the owner dashboard — to process customer transactions and reward redemptions.
              </p>
            </div>
            <button style={s.empCalloutBtn} onClick={() => navigate(EMPLOYEE_ROUTE)}>
              Send employees here →
            </button>
          </div>
        </div></FadeInSection>
      </section>

      {/* ── Merchant tools ────────────────────────────────────────────────── */}
      <section style={{ ...s.sectionAlt, padding: isMobile ? '56px 24px' : '80px 80px' }}>
        <FadeInSection><div style={s.contentMax}>
          <p style={s.tag}>MERCHANT TOOLS</p>
          <h2 style={{ ...s.h2, fontSize: isMobile ? '1.8rem' : '2.4rem' }}>Control your offers. Understand your activity.</h2>
          <div style={s.goldLine} />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', marginTop: '32px' }}>
            {[
              { title: 'Merchant-controlled offers', desc: 'Create and manage eligible rewards and redemption options for your business.' },
              { title: 'Redemption tracking', desc: 'See when rewards are redeemed and how customers interact with your offers.' },
              { title: 'Repeat visit visibility', desc: 'Understand customer return activity through merchant reporting.' },
              { title: 'Network referrals', desc: 'View activity connected to customer discovery across the Veniar Network.' },
              { title: 'Customer discovery', desc: 'Help nearby customers find your business through the app directory and map experience.' },
              { title: 'Dashboard reporting', desc: 'Use clear product dashboards to review offers, rewards, redemptions, and customer activity.' },
            ].map(card => (
              <div key={card.title} style={{ ...s.workflowCard }}>
                <p style={{ ...s.workflowTitle, marginBottom: 8 }}>{card.title}</p>
                <p style={{ ...s.workflowDesc }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div></FadeInSection>
      </section>

      {/* ── Employee portal CTA ────────────────────────────────────────── */}
      <section style={{ ...s.section, padding: isMobile ? '56px 24px' : '80px 80px' }}>
        <div style={{ ...s.empSection, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '28px' : '48px' }}>
          <div style={{ flex: 1 }}>
            <p style={s.tag}>FOR YOUR STAFF</p>
            <h2 style={{ ...s.h2, fontSize: isMobile ? '1.8rem' : '2.2rem' }}>Need employees to access Veniar?</h2>
            <div style={s.goldLine} />
            <p style={s.body}>
              Employees can use the Veniar employee portal to help customers earn and redeem rewards during day-to-day business operations. Share this link with your team — no owner credentials needed.
            </p>
            <button style={s.empBigBtn} onClick={() => navigate(EMPLOYEE_ROUTE)}>
              Open Employee Portal
            </button>
            <p style={s.empLinkNote}>{EMPLOYEE_PORTAL_URL}</p>
          </div>
          <div style={s.empBadgeBox}>
            <p style={s.empBadgeLabel}>Staff sign-in URL</p>
            <p style={s.empBadgeUrl}>{EMPLOYEE_PORTAL_URL}</p>
            <p style={s.empBadgeHint}>Copy and share with your employees</p>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────────────────── */}
      <section style={{ ...s.ctaFooter, padding: isMobile ? '56px 24px' : '80px 80px', textAlign: 'center' }}>
        <h2 style={{ ...s.h2, fontSize: isMobile ? '1.8rem' : '2.4rem' }}>Bring shared rewards to your business.</h2>
        <p style={{ ...s.body, marginBottom: '36px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
          Join <em>Veniar</em> to access rewards tools, local discovery, and merchant reporting built for independent businesses.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <button style={s.ctaPrimary} onClick={() => navigate('/business-register')}>Apply to join</button>
          <button style={s.ctaGhost} onClick={() => navigate('/business-owner')}>Business sign in</button>
        </div>
        <button style={{ ...s.footerEmpLink, marginTop: '16px', display: 'block' }} onClick={() => navigate('/support')}>
          Questions? Contact support.
        </button>
        <button style={s.footerEmpLink} onClick={() => navigate(EMPLOYEE_ROUTE)}>
          Employee portal
        </button>
      </section>

      <VeniarFooter />
    </div>
  );
}

const s = {
  root: { minHeight: '100vh', background: 'var(--vn-bg, #FFF8EA)', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", position: 'relative', overflow: 'hidden' },

  hero: { position: 'relative', zIndex: 1 },
  heroInner: { width: '100%', maxWidth: '900px' },
  eyebrow: { color: 'var(--vn-text)', opacity: 0.72, fontSize: '11px', fontWeight: '700', letterSpacing: '0.24em', margin: '0 0 20px', textTransform: 'uppercase' },
  heroTitle: { color: 'var(--vn-text)', fontWeight: '900', lineHeight: 1.06, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Archivo','Inter',sans-serif", margin: '0 0 24px' },
  goldBar: { width: '48px', height: '1px', background: 'var(--vn-line, var(--vn-card-border))', borderRadius: 0, marginBottom: '24px' },
  heroSub: { color: 'var(--vn-text-sub)', fontSize: '17px', lineHeight: 1.7, margin: '0 0 36px' },
  ctaPrimary: { padding: '14px 28px', background: 'var(--rosso)', border: 'none', color: '#FFF8EA', borderRadius: 0, fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' },
  ctaGhost: { padding: '14px 28px', background: 'transparent', border: '1.5px solid var(--vn-card-border, rgba(16,24,32,0.18))', color: 'var(--vn-text)', borderRadius: 0, fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },

  section: { position: 'relative', zIndex: 1 },
  sectionAlt: { position: 'relative', zIndex: 1, background: 'var(--vn-panel, #F7E8CF)' },
  ctaFooter: { position: 'relative', zIndex: 1 },
  contentMax: { maxWidth: '900px' },

  tag: { color: 'var(--vn-text)', opacity: 0.72, fontSize: '11px', fontWeight: '700', letterSpacing: '0.24em', margin: '0 0 14px', textTransform: 'uppercase' },
  h2: { color: 'var(--vn-text)', fontWeight: '900', lineHeight: 1.1, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Archivo','Inter',sans-serif", margin: '0 0 20px' },
  goldLine: { width: '36px', height: '1px', background: 'var(--vn-line, var(--vn-card-border))', borderRadius: 0, marginBottom: '28px' },
  body: { color: 'var(--vn-text-sub)', fontSize: '16px', lineHeight: 1.8, margin: '0 0 20px' },

  statsGrid: { display: 'grid' },
  stat: { background: 'var(--vn-card, #FFFFFF)', borderRadius: 0, padding: '22px 18px' },
  statValue: { color: 'var(--rosso)', fontWeight: '900', letterSpacing: '0.03em', margin: '0 0 8px', lineHeight: 1, fontSize: '1.8rem' },
  statLabel: { color: 'var(--vn-text-sub)', fontSize: '12px', lineHeight: 1.5, margin: 0 },

  grid: { display: 'grid' },
  problemCard: { background: 'var(--vn-card, #FFFFFF)', borderRadius: 0, padding: '20px' },
  problem: { color: '#f87171', fontSize: '13px', fontWeight: '700', margin: '0 0 8px' },
  solution: { color: 'var(--vn-text-sub)', fontSize: '13px', lineHeight: 1.6, margin: 0 },

  workflowGrid: { display: 'grid' },
  workflowCard: { background: 'var(--vn-card, #FFFFFF)', borderRadius: 0, padding: '28px 24px' },
  workflowNum: { display: 'inline-block', color: 'var(--rosso)', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', marginBottom: '14px', background: 'var(--vn-surface)', padding: '4px 10px', borderRadius: '20px' },
  workflowTitle: { color: 'var(--vn-text)', fontSize: '16px', fontWeight: '800', margin: '0 0 10px', letterSpacing: '0.01em' },
  workflowDesc: { color: 'var(--vn-text-sub)', fontSize: '14px', lineHeight: 1.7, margin: 0 },

  empCallout: { background: 'rgba(242,184,75,0.08)', border: '1px solid rgba(242,184,75,0.22)', borderRadius: 0, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
  empCalloutTitle: { color: 'var(--vn-text)', fontSize: '14px', fontWeight: '700', margin: '0 0 6px' },
  empCalloutDesc: { color: 'var(--vn-text-sub)', fontSize: '13px', lineHeight: 1.6, margin: 0, maxWidth: '480px' },
  empCalloutBtn: { padding: '12px 22px', background: 'var(--rosso)', border: 'none', color: '#FFF8EA', borderRadius: 0, fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit' },

  stepsGrid: { display: 'grid' },
  stepCard: { background: 'var(--vn-card, #FFFFFF)', borderRadius: 0, padding: '24px 20px' },
  stepNum: { display: 'inline-block', color: 'var(--rosso)', fontSize: '11px', fontWeight: '800', letterSpacing: '2px', marginBottom: '12px' },
  stepTitle: { color: 'var(--vn-text)', fontSize: '15px', fontWeight: '700', margin: '0 0 8px' },
  stepDesc: { color: 'var(--vn-text-sub)', fontSize: '13px', lineHeight: 1.6, margin: 0 },

  empSection: { display: 'flex', alignItems: 'flex-start', position: 'relative', zIndex: 1, maxWidth: '900px' },
  empBigBtn: { display: 'inline-block', padding: '15px 32px', background: 'var(--rosso)', border: 'none', color: '#FFF8EA', borderRadius: 0, fontSize: '15px', fontWeight: '700', marginBottom: '10px', cursor: 'pointer', fontFamily: 'inherit' },
  empLinkNote: { color: 'var(--vn-text-sub)', fontSize: '12px', margin: 0 },
  empBadgeBox: { background: 'var(--vn-card, #FFFFFF)', borderRadius: 0, padding: '24px 28px', minWidth: '240px', flexShrink: 0 },
  empBadgeLabel: { color: 'var(--vn-text)', fontSize: '10px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 10px' },
  empBadgeUrl: { color: 'var(--vn-text)', fontSize: '14px', fontWeight: '700', margin: '0 0 8px', wordBreak: 'break-all' },
  empBadgeHint: { color: 'var(--vn-text-sub)', fontSize: '12px', margin: 0 },

  footerEmpLink: { display: 'inline-block', marginTop: '24px', background: 'none', border: 'none', color: 'var(--vn-text-sub)', fontSize: '13px', textDecoration: 'underline', textDecorationColor: 'var(--vn-text-sub)', textUnderlineOffset: '3px', cursor: 'pointer', fontFamily: 'inherit', padding: 0 },
};
