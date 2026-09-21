import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hairline from './ui/Hairline';

const COLUMNS = [
  { title: 'Product', items: [
    { label: 'Veniar',             path: '/aboutus' },
    { label: 'Veniar Network',     path: '/network' },
    { label: 'Customer App',       path: '/customer-app' },
    { label: 'Merchant Dashboard', path: '/merchant-dashboard' },
  ]},
  { title: 'Business', items: [
    { label: 'For Business',   path: '/business-overview' },
    { label: 'Pricing',        path: '/pricing' },
    { label: 'Join',           path: '/join' },
    { label: 'Merchant Tools', path: '/merchant-dashboard' },
  ]},
  { title: 'Support', items: [
    { label: 'Help Center', path: '/support' },
    { label: 'Contact',     path: '/contact' },
    { label: 'Sign in',     path: '/signin' },
  ]},
  { title: 'Company', items: [
    { label: 'About RewardsNow', path: '/company' },
    { label: 'Mission',          path: '/mission' },
    { label: 'Partners',         path: '/partners' },
    { label: 'News',             path: '/news' },
  ]},
  { title: 'Legal', items: [
    { label: 'Privacy', path: '/privacy' },
    { label: 'Terms',   path: '/terms' },
  ]},
];

export default function VeniarFooter() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <footer style={{ background: 'var(--vn-bg)', color: 'var(--vn-text)', paddingTop: 72 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        {/* Newsletter */}
        <div style={{ marginBottom: 56, maxWidth: 480 }}>
          <p className="vn-eyebrow" style={{ marginBottom: 16 }}>Stay in the loop</p>
          {submitted ? (
            <p style={{ fontSize: 15, color: 'var(--vn-text-sub)' }}>Thanks — we'll be in touch.</p>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
              <label htmlFor="footer-email" style={{ flex: 1 }}>
                <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                  Email address
                </span>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--vn-line, var(--vn-card-border))',
                    borderRadius: 0,
                    padding: '10px 0',
                    fontSize: 16,
                    color: 'var(--vn-text)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </label>
              <button
                type="submit"
                aria-label="Subscribe"
                className="vn2-underline"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '10px 0',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--vn-text)',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Subscribe &rarr;
              </button>
            </form>
          )}
        </div>

        <Hairline style={{ marginBottom: 48 }} />

        {/* Columns */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px 40px', marginBottom: 48 }}>
          {COLUMNS.map((col) => (
            <div key={col.title} style={{ minWidth: 130, flex: '1 1 130px' }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--vn-text-sub)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}>
                {col.title}
              </div>
              {col.items.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vn-footer-link"
                    style={{
                      display: 'block',
                      padding: '5px 0',
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--vn-text)',
                      textDecoration: 'none',
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.label + item.path}
                    className="vn-footer-link"
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: '5px 0',
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--vn-text)',
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      marginBottom: 2,
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          ))}
        </div>

        <Hairline style={{ marginBottom: 20 }} />

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          paddingBottom: 24,
        }}>
          <span style={{ fontSize: 12, color: 'var(--vn-text-muted)' }}>
            &copy; 2026 RewardsNow. Veniar is a product of RewardsNow. Veniar Points are a loyalty
            program — not cash, currency, or stored value, and cannot be transferred or exchanged for money.
          </span>
          <a
            href="https://rewards-now.net"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: 'var(--vn-text-muted)', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            rewards-now.net
          </a>
        </div>
      </div>

      {/* Huge cropped wordmark */}
      <div
        aria-hidden="true"
        style={{
          overflow: 'hidden',
          height: 'clamp(80px, 14vw, 200px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <span
          className="vn-display"
          style={{
            fontSize: 'clamp(6rem, 22vw, 20rem)',
            color: 'var(--vn-surface)',
            lineHeight: 0.8,
            whiteSpace: 'nowrap',
          }}
        >
          VENIAR
        </span>
      </div>
    </footer>
  );
}
