import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from './useIsMobile';

const NAV_LINKS = [
  { label: 'Services',     path: '/services' },
  { label: 'About Us',     path: '/aboutus' },
  { label: 'For Business', path: '/business-overview' },
  { label: 'Network',      path: '/network' },
];

export default function VeniarNav({ solidFromStart = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const [scrolled, setScrolled] = useState(solidFromStart);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef(null);
  const lastScrollY = useRef(0);

  // Header goes solid with a hairline border after 80px of scroll, and
  // tucks itself away while scrolling down, reappearing as soon as you
  // scroll back up.
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (!solidFromStart) setScrolled(y > 80);

      if (y < 80) {
        setHidden(false);
      } else if (y > lastScrollY.current + 4) {
        setHidden(true);
      } else if (y < lastScrollY.current - 4) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [solidFromStart]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && closeButtonRef.current) closeButtonRef.current.focus();
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;
  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Once scrolled solid, the bar always reads as the light-theme bar
  // (cream/white with dark text) regardless of the site's dark/light
  // toggle -- only the transparent hero-overlay state adapts, since that
  // one already sits on a dark scrim either way.
  const scrolledText = '#141210';
  const textColor = scrolled ? scrolledText : 'var(--vn-text)';
  const activeColor = scrolled ? 'var(--blue-hover, #3D8FCC)' : 'var(--blue-soft)';

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: '72px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    background: scrolled ? 'rgba(255,248,234,0.92)' : 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(20,18,16,0.14)' : '1px solid transparent',
    transform: hidden && !menuOpen ? 'translateY(-100%)' : 'translateY(0)',
    transition: 'background-color 300ms var(--ease-cinematic), border-color 300ms var(--ease-cinematic), transform 350ms var(--ease-cinematic)',
  };

  const wordmarkStyle = {
    fontFamily: "'Archivo', 'Inter', sans-serif",
    fontStretch: 'expanded',
    fontWeight: 800,
    fontSize: '19px',
    letterSpacing: '0.08em',
    color: textColor,
    cursor: 'pointer',
    userSelect: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
  };

  const navLinkStyle = (path) => ({
    background: 'none',
    border: 'none',
    padding: '8px 14px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: isActive(path) ? activeColor : textColor,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    whiteSpace: 'nowrap',
  });

  const loginBtnStyle = {
    background: 'none',
    border: 'none',
    padding: '8px 14px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: textColor,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    whiteSpace: 'nowrap',
  };

  const menuBtnStyle = {
    background: 'none',
    border: `1px solid ${scrolled ? 'rgba(20,18,16,0.18)' : 'var(--vn-line, var(--vn-card-border))'}`,
    padding: '9px 18px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: textColor,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <>
      <a href="#main-content" className="vn-skip-link">Skip to content</a>

      <nav style={navStyle} aria-label="Primary">
        <button
          style={wordmarkStyle}
          onClick={() => navigate('/')}
          aria-label="Veniar home"
        >
          VENIAR
        </button>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {NAV_LINKS.map((item) => (
              <button
                key={item.path}
                className="vn-nav-btn"
                style={navLinkStyle(item.path)}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="vn-nav-btn"
              style={loginBtnStyle}
              onClick={() => navigate('/signin')}
            >
              Log in
            </button>
            <button
              className="vn2-btn vn2-btn-primary"
              onClick={() => navigate('/join')}
            >
              Join Veniar
            </button>
          </div>
        )}

        {isMobile && (
          <button
            style={menuBtnStyle}
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="veniar-mobile-menu"
          >
            Menu
          </button>
        )}
      </nav>

      {/* Mobile full-screen menu overlay */}
      {isMobile && (
        <div
          id="veniar-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'var(--vn-bg)',
            display: 'flex',
            flexDirection: 'column',
            transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 450ms var(--ease-cinematic)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: 72,
            borderBottom: '1px solid var(--vn-line, var(--vn-card-border))',
          }}>
            <span style={wordmarkStyle}>VENIAR</span>
            <button
              ref={closeButtonRef}
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              style={{
                background: 'none',
                border: '1px solid var(--vn-line, var(--vn-card-border))',
                color: 'var(--vn-text)',
                padding: '9px 18px',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Close
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...NAV_LINKS, { label: 'Pricing', path: '/pricing' }, { label: 'Support', path: '/support' }].map((item, i) => (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 16,
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--vn-line, var(--vn-card-border))',
                  padding: '20px 0',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: "'Archivo', 'Inter', sans-serif",
                  fontStretch: 'expanded',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--vn-text-sub)', letterSpacing: '0.08em' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{
                  fontSize: 'clamp(1.6rem, 9vw, 2.4rem)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  color: isActive(item.path) ? 'var(--blue-soft)' : 'var(--vn-text)',
                }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              className="vn2-btn vn2-btn-outline"
              onClick={() => go('/signin')}
            >
              Log in
            </button>
            <button
              className="vn2-btn vn2-btn-primary"
              onClick={() => go('/join')}
            >
              Join Veniar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
