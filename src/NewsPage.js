import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from './useIsMobile';
import VeniarNav from './VeniarNav';
import VeniarFooter from './VeniarFooter';
import FadeInBoth from './FadeInBoth';

const CYAN = 'var(--rosso)';
const LAGOON = 'var(--rosso)';
const YELLOW = 'var(--rosso)';

const FEATURED = {
  tag:     'Product',
  date:    'September 2026',
  title:   'Veniar opens its shared rewards network to its first cities.',
  excerpt: 'Customers can now earn and redeem rewards across a growing list of independent restaurants, cafés, and shops — all from a single app, with no loyalty card required.',
  accent:  CYAN,
};

const POSTS = [
  {
    tag:     'Guide',
    date:    'August 2026',
    title:   'How merchant-controlled offers work',
    excerpt: 'Business owners set their own reward rates and redemption rules. Here is a look at how offers are configured and shown to customers.',
    accent:  LAGOON,
  },
  {
    tag:     'Community',
    date:    'August 2026',
    title:   'Meet the businesses joining the network this quarter',
    excerpt: 'A round-up of the independent restaurants, cafés, and service providers newly onboarded to the Veniar Network.',
    accent:  'var(--rosso)',
  },
  {
    tag:     'Company',
    date:    'July 2026',
    title:   'Behind the shared rewards model',
    excerpt: 'Why we built a single rewards network that spans many independent businesses instead of a separate loyalty program for each one.',
    accent:  'var(--rosso)',
  },
  {
    tag:     'Product',
    date:    'July 2026',
    title:   'A faster way to find where to redeem',
    excerpt: 'The in-app directory now surfaces nearby participating businesses first, with maps and directions built in.',
    accent:  YELLOW,
  },
];

function ArticleCard({ tag, date, title, excerpt, accent, delay }) {
  return (
    <FadeInBoth delay={delay}>
      <div
        className="vn-card"
        style={{
          background:   'var(--vn-card)',
          border:       '1px solid var(--vn-card-border)',
          borderTop:    `3px solid ${accent}`,
          borderRadius: 0,
          padding:      '32px 28px',
          height:       '100%',
        }}
      >
        <div style={{
          display:       'flex',
          alignItems:    'center',
          gap:           10,
          marginBottom:  16,
        }}>
          <span style={{
            fontSize:      10,
            fontWeight:    700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color:         accent,
          }}>
            {tag}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--vn-text-muted)' }} />
          <span style={{ fontSize: 12, color: 'var(--vn-text-muted)' }}>{date}</span>
        </div>
        <div style={{
          fontSize:      18,
          fontWeight:    700,
          letterSpacing: '0.01em',
          color:         'var(--vn-text)',
          marginBottom:  10,
          lineHeight:    1.3,
        }}>
          {title}
        </div>
        <div style={{
          fontSize:   14,
          color:      'var(--vn-text-sub)',
          lineHeight: 1.7,
        }}>
          {excerpt}
        </div>
      </div>
    </FadeInBoth>
  );
}

export default function NewsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroBg = '#0E0D0C';

  useEffect(() => {
    document.title = 'News — RewardsNow';
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
            News and updates.
          </h1>

          {/* Gold accent bar */}
          <div style={{ ...s.goldBar, background: 'rgba(255,248,234,0.30)' }} />

          <p style={{ ...s.heroBody, maxWidth: 520 }}>
            Product releases, guides, and stories from the businesses and
            customers building the Veniar Network.
          </p>
          </div>
        </section>

        {/* ── Featured article ────────────────────────────────────────── */}
        <section
          style={{
            background: 'var(--vn-panel, #F7E8CF)',
            padding: isMobile ? '56px 0 40px' : '80px 0 48px',
          }}
        >
          <div style={{ maxWidth: '1040px', padding: isMobile ? '0 24px' : '0 8%' }}>
            <FadeInBoth>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: YELLOW, marginBottom: 16 }}>
                FEATURED
              </div>
              <div
                style={{
                  background:   'var(--vn-card)',
                  border:       '1px solid var(--vn-card-border)',
                  borderRadius: 0,
                  padding:      isMobile ? '32px 24px' : '48px 56px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: FEATURED.accent }}>
                    {FEATURED.tag}
                  </span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--vn-text-muted)' }} />
                  <span style={{ fontSize: 13, color: 'var(--vn-text-muted)' }}>{FEATURED.date}</span>
                </div>
                <h2 style={{
                  fontSize:      isMobile ? '1.7rem' : '2.2rem',
                  fontWeight:    800,
                  letterSpacing: '0.02em',
                  lineHeight:    1.2,
                  color:         'var(--vn-text)',
                  margin:        '0 0 16px',
                  maxWidth:      680,
                }}>
                  {FEATURED.title}
                </h2>
                <p style={{ fontSize: 16, color: 'var(--vn-text-sub)', lineHeight: 1.75, maxWidth: 620, margin: 0 }}>
                  {FEATURED.excerpt}
                </p>
              </div>
            </FadeInBoth>
          </div>
        </section>

        {/* ── Article grid ────────────────────────────────────────────── */}
        <section
          style={{
            background: 'var(--vn-panel, #F7E8CF)',
            padding: isMobile ? '24px 0 80px' : '32px 0 100px',
          }}
        >
          <div style={{ maxWidth: '1040px', padding: isMobile ? '0 24px' : '0 8%' }}>
            <div style={{
              display:             'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap:                 isMobile ? 20 : 28,
            }}>
              {POSTS.map((post, i) => (
                <ArticleCard key={post.title} {...post} delay={i * 80} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Stay in the loop ────────────────────────────────────────── */}
        <section
          style={{
            background: 'var(--vn-bg)',
            padding: isMobile ? '64px 0' : '96px 0',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 8%' }}>
            <FadeInBoth>
              <h2 style={{
                fontSize:      isMobile ? '2rem' : '2.6rem',
                fontWeight:    800,
                letterSpacing: '0.03em',
                lineHeight:    1.1,
                color:         'var(--vn-text)',
                margin:        '0 0 16px',
              }}>
                More stories, coming soon.
              </h2>
              <p style={s.body}>
                We are building out the full News archive. Any questions,{' '}
                <button
                  style={s.inlineLink}
                  onClick={() => navigate('/contact')}
                >
                  contact support
                </button>
                .
              </p>
            </FadeInBoth>
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
  heroBody: {
    color: 'rgba(255,248,234,0.68)',
    fontSize: '17px',
    lineHeight: 1.75,
    margin: 0,
  },
  body: {
    color: 'var(--vn-text-sub, var(--rn-text-sub))',
    fontSize: '17px',
    lineHeight: 1.75,
    margin: 0,
    textAlign: 'center',
  },
  inlineLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: CYAN,
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'underline',
  },
};
