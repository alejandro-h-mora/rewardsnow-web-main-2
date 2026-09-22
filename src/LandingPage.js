import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VeniarNav from './VeniarNav';
import VeniarFooter from './VeniarFooter';
import { useIsMobile } from './useIsMobile';
import Eyebrow from './ui/Eyebrow';
import SectionHeading from './ui/SectionHeading';
import Hairline from './ui/Hairline';
import Numeral from './ui/Numeral';
import Button from './ui/Button';
import Carousel from './ui/Carousel';
import FadeUp from './ui/FadeUp';
import Media from './ui/Media';
import VENUES from './data/venues';

const ACCENTS = ['var(--rosso-soft)', 'var(--blue-soft)'];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── "Apply to join" web/constellation hover effect ──────────────────── */
const WEB_NODES = [
  [8, 20], [18, 45], [30, 10], [42, 58], [55, 25], [68, 50], [80, 15],
  [88, 42], [15, 75], [28, 90], [42, 78], [56, 92], [70, 78], [85, 88], [95, 60], [50, 8],
];

function buildWebLines(nodes, k = 2) {
  const lines = [];
  const seen = new Set();
  nodes.forEach((a, i) => {
    const nearest = nodes
      .map((b, j) => ({ j, d: i === j ? Infinity : Math.hypot(a[0] - b[0], a[1] - b[1]) }))
      .sort((x, y) => x.d - y.d)
      .slice(0, k);
    nearest.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) { seen.add(key); lines.push([i, j]); }
    });
  });
  return lines;
}
const WEB_LINES = buildWebLines(WEB_NODES);
// Roughly where the "Apply to join" button sits (bottom-right of the
// section) -- nodes closer to it light up first, so the web reads as
// expanding outward from the button.
const WEB_ORIGIN = [92, 92];
const nodeDelay = ([x, y]) => Math.hypot(WEB_ORIGIN[0] - x, WEB_ORIGIN[1] - y) * 4;

function ApplyWeb() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      {WEB_LINES.map(([a, b], i) => {
        const [x1, y1] = WEB_NODES[a];
        const [x2, y2] = WEB_NODES[b];
        const delay = Math.min(nodeDelay(WEB_NODES[a]), nodeDelay(WEB_NODES[b]));
        return (
          <line
            key={i}
            className="vn2-web-line"
            x1={x1} y1={y1} x2={x2} y2={y2}
            style={{ transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` }}
          />
        );
      })}
      {WEB_NODES.map(([x, y], i) => (
        <circle
          key={i}
          className="vn2-web-dot"
          cx={x} cy={y} r={1.1}
          style={{ transitionDelay: `${nodeDelay([x, y])}ms` }}
        />
      ))}
    </svg>
  );
}

/* ── Rolling digit animation for the points balance ───────────────────── */
function RollingPoints({ value }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} style={{ display: 'inline-block' }}>
      {value.split('').map((ch, i) => (
        <span
          key={i}
          className={visible ? 'vn2-digit-roll' : ''}
          style={{ display: 'inline-block', animationDelay: `${i * 90}ms` }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/* ── The three-value strip ───────────────────────────────────────────── */
const VALUES = [
  { num: '01', title: 'Earn locally', body: 'Earn rewards at participating businesses in your community.' },
  { num: '02', title: 'Redeem across the network', body: 'Use eligible rewards at any participating Veniar business.' },
  { num: '03', title: 'Community rewards, simplified.', body: 'Find local restaurants, cafés, shops, and services through the app.' },
];

const BUSINESS_BENEFITS = [
  'Shared rewards across the network.',
  'Merchant-controlled offers and rates.',
  'Customer discovery, built in.',
];

// Example activity only — no real transaction history yet, so these are
// generic categories rather than invented business names.
const RECENT_ACTIVITY = [
  { label: 'Local restaurant', detail: 'Dinner for two', pts: '+12 pts' },
  { label: 'Neighborhood café', detail: 'Morning coffee', pts: '+3 pts' },
  { label: 'Local bookstore', detail: 'Redeemed reward', pts: '−25 pts' },
];

/* ── Points card, with a max-4deg pointer tilt ───────────────────────── */
function PointsCard() {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (prefersReducedMotion() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 8 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        background: 'var(--vn-surface)',
        border: '1px solid var(--vn-line, var(--vn-card-border))',
        padding: '40px 36px',
        maxWidth: 420,
        width: '100%',
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 250ms var(--ease-cinematic)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <span className="vn-eyebrow" style={{ opacity: 0.6 }}>Veniar Member</span>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--amber)',
          border: '1px solid var(--amber)',
          padding: '4px 10px',
        }}>
          Gold Tier
        </span>
      </div>

      <div className="vn-display" style={{ fontSize: 'clamp(2.6rem, 6vw, 3.6rem)', marginBottom: 4, letterSpacing: '0.01em' }}>
        <RollingPoints value="1,240" /> <span style={{ fontSize: '0.4em', color: 'var(--vn-text-sub)' }}>PTS</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--vn-text-muted)', marginBottom: 28 }}>Balance across the network</p>

      <Hairline style={{ marginBottom: 20 }} />

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--vn-text-sub)', marginBottom: 14 }}>
        Recent activity
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {RECENT_ACTIVITY.map((a) => (
          <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--vn-text)' }}>{a.label}</div>
              <div style={{ fontSize: 12, color: 'var(--vn-text-muted)' }}>{a.detail}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: a.pts.startsWith('+') ? 'var(--amber)' : 'var(--vn-text-sub)', whiteSpace: 'nowrap' }}>
              {a.pts}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Network carousel card — honest "coming soon" placeholder ────────── */
function VenueCard({ venue, index, isMobile, navigate }) {
  const accent = ACCENTS[index % ACCENTS.length];
  return (
    <div style={{ width: isMobile ? '85vw' : 360 }}>
      <div style={{
        width: '100%',
        aspectRatio: '4 / 5',
        marginBottom: 20,
        background: 'linear-gradient(135deg, var(--vn-surface) 0%, var(--vn-panel-strong, var(--vn-surface)) 100%)',
        border: '1px solid var(--vn-line, var(--vn-card-border))',
        borderTopWidth: 3,
        borderTopColor: accent,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        textAlign: 'center',
        padding: 24,
      }}>
        <span style={{ fontSize: 28, opacity: 0.35 }} aria-hidden="true">+</span>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--vn-text-muted)',
        }}>
          Coming soon
        </span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--vn-text-sub)', textTransform: 'uppercase', marginBottom: 6 }}>
        {venue.category}
      </div>
      <div className="vn-display" style={{ fontSize: '1.15rem', marginBottom: 10, letterSpacing: '0.02em' }}>
        A local favorite, joining soon
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: accent,
          border: `1px solid ${accent}`,
          padding: '4px 10px',
        }}>
          Not yet open
        </span>
        <button
          className="vn2-underline"
          onClick={() => navigate('/network')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--vn-text)',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Learn more
        </button>
      </div>
    </div>
  );
}

/* ── LandingPage (main export) ───────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = 'Veniar | Shared Rewards for Local Businesses';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: 'var(--vn-bg)', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <VeniarNav />

      <main id="main-content">
        {/* ── 1. Hero ─────────────────────────────────────────────────── */}
        <section
          aria-label="Introduction"
          style={{
            position: 'relative',
            height: '100svh',
            minHeight: 560,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <Media
              src="/images/hero.jpg"
              alt="A local café glowing at golden hour, tables full of neighbors."
              style={{ width: '100%', height: '100%' }}
              imgClassName="vn2-hero-media"
              loading="eager"
            />
          </div>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(14,13,12,0.15) 0%, rgba(14,13,12,0.55) 55%, rgba(14,13,12,0.92) 100%)',
            }}
          />

          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            padding: isMobile ? '0 24px 56px' : '0 8% 64px',
          }}>
            <FadeUp>
              <p className="vn-eyebrow" style={{ color: '#FFF8EA', opacity: 0.85, marginBottom: 18 }}>
                Local Rewards Network
              </p>
            </FadeUp>
            <FadeUp delay={80}>
              <h1
                className="vn-display"
                style={{
                  color: '#FFF8EA',
                  fontSize: 'clamp(2.2rem, 6.5vw, 4.8rem)',
                  maxWidth: 820,
                  marginBottom: 24,
                }}
              >
                Earn rewards while supporting local businesses.
              </h1>
            </FadeUp>
            <FadeUp delay={160}>
              <p style={{
                fontSize: isMobile ? 15 : 17,
                color: 'rgba(255,248,234,0.75)',
                lineHeight: 1.7,
                maxWidth: '52ch',
                marginBottom: 36,
              }}>
                Veniar helps you earn rewards when you shop at participating independent
                businesses in your community. Discover nearby restaurants, cafés, shops, and
                local services, then use your rewards across the Veniar Network.
              </p>
            </FadeUp>
            <FadeUp delay={240}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Button variant="primary" onClick={() => navigate('/join')}>Download app</Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/business-overview')}
                  style={{ color: '#FFF8EA', borderColor: 'rgba(255,248,234,0.4)' }}
                >
                  For business owners
                </Button>
              </div>
            </FadeUp>
          </div>

          <div
            aria-hidden="true"
            className="vn2-scroll-indicator"
            style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 1,
              height: 40,
              background: 'rgba(255,248,234,0.5)',
              zIndex: 1,
            }}
          />
        </section>

        {/* ── 2. Three-value strip ───────────────────────────────────── */}
        <section
          aria-label="How Veniar works"
          style={{
            background: 'var(--vn-bg)',
            padding: isMobile ? '64px 24px' : '96px 8%',
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? 40 : 32,
          }}>
            {VALUES.map((v, i) => (
              <FadeUp key={v.num} delay={i * 80}>
                <div className={i % 2 === 0 ? 'vn2-numeral-hover' : 'vn2-numeral-hover-blue'}>
                  <Hairline style={{ marginBottom: 20 }} />
                  <Numeral size={64} style={{ display: 'block', marginBottom: 20 }}>{v.num}</Numeral>
                  <div className="vn-display" style={{ fontSize: '1.15rem', marginBottom: 12 }}>
                    {v.title}
                  </div>
                  <p style={{ fontSize: 15, color: 'var(--vn-text-sub)', lineHeight: 1.7 }}>
                    {v.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── 3. The Network (carousel) ──────────────────────────────── */}
        <section
          aria-labelledby="network-heading"
          style={{
            background: 'var(--vn-surface)',
            padding: isMobile ? '64px 0' : '96px 0',
          }}
        >
          <div style={{ padding: isMobile ? '0 24px' : '0 8%', marginBottom: 48 }}>
            <FadeUp>
              <Eyebrow style={{ marginBottom: 16 }}>The Network</Eyebrow>
              <SectionHeading id="network-heading" size="md" style={{ marginBottom: 20 }}>
                We're building the network.
              </SectionHeading>
              <p style={{ fontSize: 16, color: 'var(--vn-text-sub)', lineHeight: 1.75, maxWidth: 560 }}>
                Restaurants, cafés, shops, and local services are joining Veniar soon. Check back
                for the full directory, with maps and directions to plan your visit.
              </p>
            </FadeUp>
          </div>

          <div style={{ padding: isMobile ? '0 24px' : '0 8%' }}>
            <FadeUp delay={80}>
              <Carousel
                ariaLabel="Participating venues"
                items={VENUES}
                cardWidth={isMobile ? '85vw' : '360px'}
                renderItem={(venue, index) => (
                  <VenueCard venue={venue} index={index} isMobile={isMobile} navigate={navigate} />
                )}
              />
            </FadeUp>
          </div>
        </section>

        {/* ── 4. Points card ──────────────────────────────────────────── */}
        <section
          aria-labelledby="points-heading"
          style={{
            background: 'var(--vn-bg)',
            padding: isMobile ? '64px 24px' : '96px 8%',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 48 : 80,
            alignItems: 'center',
          }}
        >
          <FadeUp style={{ flex: 1, maxWidth: 480 }}>
            <Eyebrow style={{ marginBottom: 16 }}>Your balance</Eyebrow>
            <SectionHeading id="points-heading" size="md" style={{ marginBottom: 20 }}>
              One balance, the whole network.
            </SectionHeading>
            <p style={{ fontSize: 16, color: 'var(--vn-text-sub)', lineHeight: 1.75 }}>
              Earn points on eligible purchases at any participating business, then redeem them
              at any other business in the network — not just where you earned them. Your
              balance and recent activity are always visible in the app.
            </p>
          </FadeUp>
          <FadeUp delay={120} style={{ flex: '0 0 auto', width: '100%', display: 'flex', justifyContent: isMobile ? 'stretch' : 'center' }}>
            <PointsCard />
          </FadeUp>
        </section>

        {/* ── 5. For business owners band ────────────────────────────── */}
        <section
          aria-labelledby="business-heading"
          className="vn2-web-section"
          style={{
            background: 'var(--rosso)',
            padding: isMobile ? '72px 24px' : '120px 8%',
          }}
        >
          <ApplyWeb />
          <FadeUp style={{ position: 'relative' }}>
            <Eyebrow style={{ color: '#FFF8EA', opacity: 0.85, marginBottom: 20 }}>For Businesses</Eyebrow>
            <SectionHeading
              id="business-heading"
              as="h2"
              size="lg"
              style={{ color: '#FFF8EA', maxWidth: 900, marginBottom: 36, fontSize: 'clamp(2.4rem, 7vw, 5.5rem)' }}
            >
              Shared rewards infrastructure for independent businesses.
            </SectionHeading>

            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 32 : 64,
              alignItems: isMobile ? 'flex-start' : 'flex-end',
              justifyContent: 'space-between',
            }}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {BUSINESS_BENEFITS.map((line) => (
                  <li key={line} style={{ fontSize: 16, color: 'rgba(255,248,234,0.85)' }}>
                    {line}
                  </li>
                ))}
              </ul>

              <button
                className="vn2-apply-btn"
                onClick={() => navigate('/business-overview')}
                style={{
                  background: '#FFF8EA',
                  color: 'var(--rosso)',
                  border: '1px solid #FFF8EA',
                  borderRadius: 0,
                  padding: '16px 32px',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: 'nowrap',
                  transition: 'background-color 300ms var(--ease-cinematic), color 300ms var(--ease-cinematic)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FFF8EA'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#FFF8EA'; e.currentTarget.style.color = 'var(--rosso)'; }}
              >
                Apply to join
              </button>
            </div>
          </FadeUp>
        </section>
      </main>

      <VeniarFooter />
    </div>
  );
}
