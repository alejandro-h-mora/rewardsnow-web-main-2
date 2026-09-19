import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import VeniarNav from './VeniarNav';
import VeniarFooter from './VeniarFooter';
import FadeInBoth from './FadeInBoth';
import { useIsMobile } from './useIsMobile';

/* ── Brand palette ────────────────────────────────────────────────────── */
const CYAN    = '#1692A2';
const LAGOON  = '#0E96CD';
const DEEP    = '#0F6356';
const NIGHT   = '#0A1211';
const YELLOW  = '#F8C922';
const MUTED   = '#5F6B73';

/* ── StepItem ─────────────────────────────────────────────────────────── */
function StepItem({ num, title, body, delay, numColor }) {
  return (
    <FadeInBoth delay={delay}>
      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        <div style={{
          fontSize:      '3.5rem',
          fontWeight:    900,
          color:         numColor || CYAN,
          lineHeight:    1,
          marginBottom:  14,
          letterSpacing: '-0.04em',
        }}>
          {num}
        </div>
        <div style={{
          fontSize:     17,
          fontWeight:   700,
          color:        'var(--vn-text)',
          marginBottom: 10,
        }}>
          {title}
        </div>
        <div style={{
          fontSize:   14,
          color:      MUTED,
          lineHeight: 1.7,
        }}>
          {body}
        </div>
      </div>
    </FadeInBoth>
  );
}

/* ── ServiceCard ──────────────────────────────────────────────────────── */
function ServiceCard({ title, body, accent, delay }) {
  return (
    <FadeInBoth delay={delay}>
      <div
        className="vn-card"
        style={{
          background:   'var(--vn-card)',
          border:       '1px solid var(--vn-card-border)',
          borderTop:    `3px solid ${accent}`,
          borderRadius: 14,
          padding:      '40px 36px',
        }}
      >
        <div style={{
          width:        32,
          height:       3,
          background:   accent,
          borderRadius: 2,
          marginBottom: 20,
          opacity:      0.5,
        }} />
        <div style={{
          fontSize:      17,
          fontWeight:    700,
          color:         'var(--vn-text)',
          marginBottom:  12,
          letterSpacing: '-0.01em',
        }}>
          {title}
        </div>
        <div style={{
          fontSize:   15,
          color:      'var(--vn-text-sub)',
          lineHeight: 1.75,
        }}>
          {body}
        </div>
      </div>
    </FadeInBoth>
  );
}

/* ── LandingPage (main export) ────────────────────────────────────────── */
export default function LandingPage() {
  const navigate  = useNavigate();
  const isMobile  = useIsMobile();
  const { isDark } = useTheme();

  useEffect(() => {
    document.title = 'Veniar | Shared Rewards for Local Businesses';
    window.scrollTo(0, 0);
  }, []);

  const CONTENT_MAX = 1040;
  const inner = { maxWidth: CONTENT_MAX, margin: '0 auto' };

  const heroBg = isDark ? NIGHT : '#1295AA';

  /* ── SECTION 1 — HERO ─────────────────────────────────────────────── */
  const heroSection = (
    <section
      style={{
        minHeight:     '100vh',
        background:    heroBg,
        paddingTop:    isMobile ? 100 : 64,
        paddingBottom: isMobile ? 72  : 96,
        paddingLeft:   isMobile ? 24  : '8%',
        paddingRight:  isMobile ? 24  : '8%',
        display:       'flex',
        alignItems:    'center',
        position:      'relative',
        overflow:      'hidden',
      }}
    >
      {/* Animated diagonal stripes — replaces the old wordmark */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          overflow:      'hidden',
          pointerEvents: 'none',
          userSelect:    'none',
          zIndex:        0,
        }}
      >
        {[
          { left: '6%',  width: 5, color: CYAN,   dur: 7,   delay: 0    },
          { left: '20%', width: 3, color: YELLOW, dur: 9,   delay: -2   },
          { left: '35%', width: 6, color: LAGOON, dur: 8,   delay: -4   },
          { left: '52%', width: 3, color: CYAN,   dur: 10,  delay: -1   },
          { left: '68%', width: 5, color: YELLOW, dur: 7.5, delay: -3   },
          { left: '84%', width: 4, color: LAGOON, dur: 9.5, delay: -5   },
        ].map((st, i) => (
          <div
            key={i}
            className="vn-hero-stripe"
            style={{
              position:          'absolute',
              top:               '-50%',
              left:              st.left,
              width:             st.width,
              height:            '220%',
              background:        st.color,
              opacity:           0.14,
              animationDuration: `${st.dur}s`,
              animationDelay:    `${st.delay}s`,
            }}
          />
        ))}
      </div>

      <div style={{ ...inner, width: '100%', position: 'relative', zIndex: 1 }}>
        <FadeInBoth>
          {/* Eyebrow */}
          <div style={{
            fontSize:      11,
            fontWeight:    700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         YELLOW,
            marginBottom:  24,
            textAlign:     'center',
          }}>
            LOCAL REWARDS NETWORK
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize:      isMobile ? '2.2rem' : '4rem',
            fontWeight:    900,
            letterSpacing: '-0.04em',
            lineHeight:    1.05,
            color:         '#FFF8EA',
            margin:        '0 auto',
            maxWidth:      680,
            textAlign:     'center',
          }}>
            Earn rewards while supporting local businesses.
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize:     isMobile ? 15 : 17,
            color:        'rgba(255,248,234,0.68)',
            lineHeight:   1.7,
            maxWidth:     520,
            margin:       '32px auto 48px',
            textAlign:    'center',
          }}>
            <em>Veniar</em> helps you earn rewards when you shop at participating independent businesses in your community. Discover nearby restaurants, cafés, shops, and local services, then use your rewards across the <em>Veniar</em> Network.
          </p>

          {/* CTA row */}
          <div style={{
            display:    'flex',
            flexWrap:   'wrap',
            gap:        12,
            alignItems:     'center',
            justifyContent: 'center',
            marginBottom:   64,
          }}>
            <button
              className="vn-cta-primary"
              style={{
                background:   LAGOON,
                color:        '#fff',
                border:       'none',
                padding:      '16px 36px',
                borderRadius: 9,
                fontSize:     16,
                fontWeight:   700,
                cursor:       'pointer',
                fontFamily:   'inherit',
              }}
              onClick={() => navigate('/join')}
            >
              Download app
            </button>
            <button
              style={{
                background:   'transparent',
                color:        'rgba(255,248,234,0.75)',
                border:       '1.5px solid rgba(255,248,234,0.22)',
                padding:      '16px 36px',
                borderRadius: 9,
                fontSize:     16,
                fontWeight:   700,
                cursor:       'pointer',
                fontFamily:   'inherit',
              }}
              onClick={() => navigate('/business-overview')}
            >
              For business owners
            </button>
          </div>

          {/* Mission strip */}
          <div style={{
            display:       'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap:           isMobile ? 20 : 0,
            borderTop:     '1px solid rgba(255,248,234,0.10)',
            paddingTop:    32,
          }}>
            {[
              { label: 'Earn locally',                  sub: 'Earn rewards at participating businesses in your community.',             accent: CYAN      },
              { label: 'Redeem across the network',     sub: 'Use eligible rewards at any participating Veniar business.',              accent: '#5CB2C9' },
              { label: 'Community rewards, simplified.', sub: 'Find local restaurants, cafés, shops, and services through the app.',    accent: '#648D62' },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{
                  flex:        1,
                  paddingLeft: isMobile ? 0 : (i > 0 ? 40 : 0),
                  borderLeft:  (!isMobile && i > 0) ? '1px solid rgba(255,248,234,0.08)' : 'none',
                }}
              >
                <div style={{
                  width:        28,
                  height:       3,
                  background:   item.accent,
                  borderRadius: 2,
                  marginBottom: 12,
                }} />
                <div style={{
                  fontSize:     15,
                  fontWeight:   700,
                  color:        '#FFF8EA',
                  marginBottom: 6,
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize:   14,
                  color:      'rgba(255,248,234,0.50)',
                  lineHeight: 1.6,
                }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </FadeInBoth>
      </div>
    </section>
  );

  /* ── SECTION 2 — HOW IT WORKS ─────────────────────────────────────── */
  const howSection = (
    <section style={{
      background:    'var(--vn-panel)',
      paddingTop:    isMobile ? 80  : 120,
      paddingBottom: isMobile ? 80  : 120,
      paddingLeft:   isMobile ? 24  : '8%',
      paddingRight:  isMobile ? 24  : '8%',
    }}>
      <div style={inner}>
        <FadeInBoth>
          {/* Eyebrow */}
          <div style={{
            fontSize:      11,
            fontWeight:    700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         YELLOW,
            marginBottom:  16,
          }}>
            HOW IT WORKS
          </div>

          {/* H2 */}
          <h2 style={{
            fontSize:      isMobile ? '2.4rem' : '3.2rem',
            fontWeight:    800,
            letterSpacing: '-0.03em',
            lineHeight:    1.08,
            color:         'var(--vn-text)',
            margin:        0,
          }}>
            Shop local. Earn rewards. Redeem across the network.
          </h2>

          {/* Gold accent bar */}
          <div style={{
            width:        44,
            height:       3,
            background:   YELLOW,
            borderRadius: 2,
            margin:       '20px 0 36px',
          }} />
        </FadeInBoth>

        <FadeInBoth delay={60}>
          <p style={{ fontSize: 16, color: 'var(--vn-text-sub)', lineHeight: 1.75, maxWidth: 560, margin: '0 0 32px' }}>
            Buy from a participating local business and earn rewards through <em>Veniar</em>. Later, redeem eligible rewards at participating businesses across the network — whether that is coffee, lunch, dessert, or another local favorite.
          </p>
        </FadeInBoth>

        {/* Step items row */}
        <div style={{
          display:       'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap:           isMobile ? 48 : 0,
          alignItems:    isMobile ? 'stretch' : 'flex-start',
        }}>
          <StepItem
            num="01"
            title="Shop with participating businesses"
            body={<>Visit local restaurants, cafés, shops, and service providers that participate in <em>Veniar</em>.</>}
            numColor="#1692A2"
            delay={0}
          />

          {/* Vertical divider — desktop only */}
          {!isMobile && (
            <div style={{
              width:          1,
              background:     'rgba(22,146,162,0.25)',
              height:         60,
              alignSelf:      'center',
              flexShrink:     0,
              margin:         '0 40px',
            }} />
          )}

          <StepItem
            num="02"
            title="Earn rewards on eligible purchases"
            body={<>Earn rewards based on participating business rules and eligible activity.</>}
            numColor="#0E96CD"
            delay={120}
          />

          {/* Vertical divider — desktop only */}
          {!isMobile && (
            <div style={{
              width:      1,
              background: 'rgba(22,146,162,0.25)',
              height:     60,
              alignSelf:  'center',
              flexShrink: 0,
              margin:     '0 40px',
            }} />
          )}

          <StepItem
            num="03"
            title="Redeem locally"
            body="Use eligible rewards at participating businesses in the Veniar Network."
            numColor="#648D62"
            delay={240}
          />

          {!isMobile && (
            <div style={{ width: 1, background: 'rgba(22,146,162,0.25)', height: 60, alignSelf: 'center', flexShrink: 0, margin: '0 40px' }} />
          )}
          <StepItem
            num="04"
            title="Discover where to go next"
            body="Find nearby businesses, view details, and plan your visit from the app."
            numColor="#F2B84B"
            delay={360}
          />
        </div>

        <FadeInBoth delay={400}>
          <p style={{ fontSize: 13, color: 'var(--vn-text-muted, #8A9199)', lineHeight: 1.7, maxWidth: 600, marginTop: 32, fontStyle: 'italic' }}>
            Rewards are connected to participating businesses in the <em>Veniar</em> Network. Availability, offers, and redemption options may vary by business.
          </p>
        </FadeInBoth>
      </div>
    </section>
  );

  /* ── SECTION 3 — FOR BUSINESS ─────────────────────────────────────── */
  const businessBg = isDark ? NIGHT : DEEP;

  const businessSection = (
    <section style={{
      background:    businessBg,
      paddingTop:    isMobile ? 80  : 120,
      paddingBottom: isMobile ? 80  : 120,
      paddingLeft:   isMobile ? 24  : '8%',
      paddingRight:  isMobile ? 24  : '8%',
    }}>
      <div style={inner}>
        <FadeInBoth>
          {/* Eyebrow */}
          <div style={{
            fontSize:      11,
            fontWeight:    700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         YELLOW,
            marginBottom:  16,
          }}>
            FOR BUSINESSES
          </div>

          {/* H2 */}
          <h2 style={{
            fontSize:      isMobile ? '2.4rem' : '3.2rem',
            fontWeight:    800,
            letterSpacing: '-0.03em',
            lineHeight:    1.08,
            color:         '#FFF8EA',
            margin:        0,
          }}>
            Shared rewards infrastructure for independent businesses.
          </h2>

          {/* Gold accent bar */}
          <div style={{
            width:        44,
            height:       3,
            background:   YELLOW,
            borderRadius: 2,
            margin:       '20px 0 36px',
          }} />

          {/* Body */}
          <p style={{
            fontSize:     isMobile ? 16 : 18,
            color:        'rgba(255,248,234,0.68)',
            lineHeight:   1.75,
            maxWidth:     560,
            marginBottom: 44,
          }}>
            <em>Veniar</em> gives independent businesses access to shared rewards, merchant-controlled offers, and customer discovery tools — without requiring every business to build its own loyalty system from scratch.
          </p>

          {/* CTAs */}
          <div style={{
            display:    'flex',
            flexWrap:   'wrap',
            gap:        12,
            alignItems: 'center',
          }}>
            <button
              className="vn-cta-primary"
              style={{
                background:   CYAN,
                color:        NIGHT,
                border:       'none',
                padding:      '14px 28px',
                borderRadius: 9,
                fontSize:     15,
                fontWeight:   700,
                cursor:       'pointer',
                fontFamily:   'inherit',
              }}
              onClick={() => navigate('/business-overview')}
            >
              Apply to join
            </button>
            <button
              className="vn-cta-ghost"
              style={{
                background:   'transparent',
                color:        'rgba(255,248,234,0.80)',
                border:       '1.5px solid rgba(255,248,234,0.24)',
                padding:      '14px 28px',
                borderRadius: 9,
                fontSize:     15,
                fontWeight:   700,
                cursor:       'pointer',
                fontFamily:   'inherit',
              }}
              onClick={() => navigate('/aboutus')}
            >
              Learn more →
            </button>
          </div>
        </FadeInBoth>
      </div>
    </section>
  );

  /* ── SECTION 4 — SERVICES ─────────────────────────────────────────── */
  const servicesSection = (
    <section style={{
      background:    'var(--vn-bg)',
      paddingTop:    isMobile ? 80  : 120,
      paddingBottom: isMobile ? 80  : 120,
      paddingLeft:   isMobile ? 24  : '8%',
      paddingRight:  isMobile ? 24  : '8%',
    }}>
      <div style={inner}>
        <FadeInBoth>
          {/* Eyebrow */}
          <div style={{
            fontSize:      11,
            fontWeight:    700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         YELLOW,
            marginBottom:  16,
          }}>
            WHAT YOU GET
          </div>

          {/* H2 */}
          <h2 style={{
            fontSize:      isMobile ? '2.4rem' : '3.2rem',
            fontWeight:    800,
            letterSpacing: '-0.03em',
            lineHeight:    1.08,
            color:         'var(--vn-text)',
            margin:        0,
          }}>
            Everything local rewards need, in one app.
          </h2>

          {/* Gold accent bar */}
          <div style={{
            width:        44,
            height:       3,
            background:   YELLOW,
            borderRadius: 2,
            margin:       '20px 0 36px',
          }} />
        </FadeInBoth>

        {/* 2-col grid */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap:                 isMobile ? 20 : 32,
          alignItems:          'start',
        }}>
          <ServiceCard title="Earn on everyday visits" body="Collect rewards when you shop with participating local businesses." accent="#1692A2" delay={0} />
          <ServiceCard title="Redeem across participating businesses" body={<>Use eligible rewards at participating <em>Veniar</em> businesses, not only where you earned them.</>} accent="#0E96CD" delay={80} />
          <ServiceCard title="Discover nearby places" body="Find restaurants, cafés, shops, and services that are part of the network." accent="#5CB2C9" delay={160} />
          <ServiceCard title="Plan your visit" body="View business details, menus or offerings when available, maps, and directions." accent="#648D62" delay={240} />
          <ServiceCard title="Support independent businesses" body={<>Choose local businesses while participating in a shared rewards experience.</>} accent="#D66024" delay={320} />
          <ServiceCard title="Keep it simple" body="See rewards, nearby businesses, and redemption options in one product experience." accent="#F2B84B" delay={400} />
        </div>

        {/* Text link below */}
        <div style={{ marginTop: 36 }}>
          <FadeInBoth delay={280}>
            <button
              style={{
                background:  'none',
                border:      'none',
                padding:     0,
                fontSize:    15,
                fontWeight:  600,
                color:       LAGOON,
                cursor:      'pointer',
                fontFamily:  'inherit',
              }}
              onClick={() => navigate('/services')}
            >
              See all services →
            </button>
          </FadeInBoth>
        </div>
      </div>
    </section>
  );

  /* ── SECTION 5 — TRUST / LEGAL ────────────────────────────────────── */
  const trustSection = (
    <section style={{
      background:    'var(--vn-section-alt)',
      paddingTop:    isMobile ? 56 : 72,
      paddingBottom: isMobile ? 56 : 72,
      paddingLeft:   isMobile ? 24 : '8%',
      paddingRight:  isMobile ? 24 : '8%',
    }}>
      <div style={inner}>
        <FadeInBoth>
          <p style={{
            fontSize:   13,
            color:      'var(--vn-text-muted)',
            lineHeight: 1.7,
            textAlign:  'center',
            maxWidth:   480,
            margin:     '0 auto',
          }}>
            <em>Veniar</em> Points are a loyalty program. They are not cash,
            currency, or stored value. They cannot be transferred or exchanged
            for money. Subject to program terms.
          </p>
        </FadeInBoth>
      </div>
    </section>
  );

  /* ── SECTION 5b — DIRECTORY ──────────────────────────────────────── */
  const directorySection = (
    <section style={{
      background:    'var(--vn-panel)',
      paddingTop:    isMobile ? 80  : 120,
      paddingBottom: isMobile ? 80  : 120,
      paddingLeft:   isMobile ? 24  : '8%',
      paddingRight:  isMobile ? 24  : '8%',
    }}>
      <div style={inner}>
        <FadeInBoth>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: YELLOW, marginBottom: 16 }}>
            THE DIRECTORY
          </div>
          <h2 style={{ fontSize: isMobile ? '2.4rem' : '3.2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, color: 'var(--vn-text)', margin: 0 }}>
            Not sure where to use your rewards?
          </h2>
          <div style={{ width: 44, height: 3, background: YELLOW, borderRadius: 2, margin: '20px 0 24px' }} />
          <p style={{ fontSize: isMobile ? 16 : 18, color: 'var(--vn-text-sub)', lineHeight: 1.75, maxWidth: 560, marginBottom: 36 }}>
            The <em>Veniar</em> app includes a directory of participating businesses so customers can find places nearby. Browse restaurants, cafés, shops, and local services, then use maps and directions to plan your visit.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <button
              className="vn-cta-primary"
              style={{ background: LAGOON, color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 9, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => navigate('/join')}
            >
              Open directory
            </button>
            <button
              style={{ background: 'transparent', color: 'var(--vn-text)', border: '1.5px solid var(--vn-card-border)', padding: '14px 28px', borderRadius: 9, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => navigate('/join')}
            >
              Download app
            </button>
          </div>
        </FadeInBoth>
      </div>
    </section>
  );

  /* ── SECTION 6 — FINAL CTA ────────────────────────────────────────── */
  const finalCtaSection = (
    <section style={{
      background:    'var(--vn-bg)',
      paddingTop:    isMobile ? 80  : 120,
      paddingBottom: isMobile ? 80  : 120,
      paddingLeft:   isMobile ? 24  : '8%',
      paddingRight:  isMobile ? 24  : '8%',
      textAlign:     'center',
    }}>
      <div style={inner}>
        <FadeInBoth>
          <h2 style={{
            fontSize:      isMobile ? '2.6rem' : '4rem',
            fontWeight:    800,
            letterSpacing: '-0.03em',
            lineHeight:    1.08,
            color:         'var(--vn-text)',
            margin:        0,
          }}>
            Start earning rewards locally.
          </h2>

          <p style={{
            fontSize:     isMobile ? 16 : 18,
            color:        'var(--vn-text-sub)',
            lineHeight:   1.75,
            marginBottom: 44,
            marginTop:    24,
          }}>
            Download <em>Veniar</em> to discover participating businesses, earn rewards on eligible purchases, and redeem across the local network.
          </p>

          <div style={{
            display:        'flex',
            flexWrap:       'wrap',
            gap:            12,
            justifyContent: 'center',
            alignItems:     'center',
          }}>
            <button
              className="vn-cta-primary"
              style={{
                background:   LAGOON,
                color:        '#fff',
                border:       'none',
                padding:      '14px 28px',
                borderRadius: 9,
                fontSize:     15,
                fontWeight:   700,
                cursor:       'pointer',
                fontFamily:   'inherit',
              }}
              onClick={() => navigate('/register')}
            >
              Download app
            </button>
            <button
              className="vn-cta-ghost"
              style={{
                background:   'transparent',
                color:        'var(--vn-text)',
                border:       '1.5px solid var(--vn-card-border)',
                padding:      '14px 28px',
                borderRadius: 9,
                fontSize:     15,
                fontWeight:   700,
                cursor:       'pointer',
                fontFamily:   'inherit',
              }}
              onClick={() => navigate('/business-overview')}
            >
              Business owner? Learn how to join
            </button>
          </div>
        </FadeInBoth>
      </div>
    </section>
  );

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <div style={{ background: 'var(--vn-bg)', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <VeniarNav />
      {heroSection}
      {howSection}
      {businessSection}
      {servicesSection}
      {directorySection}
      {trustSection}
      {finalCtaSection}
      <VeniarFooter />
    </div>
  );
}
