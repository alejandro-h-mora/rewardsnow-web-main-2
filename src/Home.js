import { useEffect, useState } from 'react';
import { API } from './config';
import { useIsMobile } from './useIsMobile';

export default function Home({ customer, onLogout, onNavigate, refreshKey }) {
  const isMobile = useIsMobile();
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(customer.rnBalance ?? 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${customer.token}` };
    Promise.all([
      fetch(`${API}/ledger/${customer.customerId}/history`, { headers }),
      fetch(`${API}/customers/${customer.customerId}/balance`, { headers }),
    ])
        .then(([hRes, bRes]) => Promise.all([hRes.json(), bRes.json()]))
        .then(([hData, bData]) => {
          setHistory(Array.isArray(hData) ? hData : []);
          setBalance(bData.rnBalance ?? customer.rnBalance ?? 0);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer.customerId, customer.token, refreshKey]);

  return (
      <div style={s.root}>
        <div style={s.orb1} />
        <div style={s.orb2} />

        <nav style={{ ...s.nav, padding: isMobile ? '0 16px' : '0 40px' }}>
          <button style={s.navBrand} onClick={() => onNavigate('/home')}>Veniar</button>
          <div style={s.navRight}>
            <button style={s.navLink} onClick={() => onNavigate('/businesses')}>Partners</button>
            <button style={s.navLink} onClick={() => onNavigate('/map')}>Map</button>
            <button style={s.navLink} onClick={() => onNavigate('/settings')}>Settings</button>
            <button style={s.navLogout} onClick={onLogout}>Sign out</button>
          </div>
        </nav>

        <div style={{ ...s.body, padding: isMobile ? '20px 16px' : '40px 24px' }}>
          {/* Balance hero */}
          <div style={{ ...s.hero, padding: isMobile ? '28px 24px' : '40px 44px' }}>
            <p style={s.heroGreeting}>Good to see you, {customer.username}.</p>
            <div style={s.balanceRow}>
              <span style={{ ...s.balanceNum, fontSize: isMobile ? '3rem' : '4rem' }}>
                {loading ? '—' : balance.toLocaleString()}
              </span>
              <span style={s.balancePts}>pts</span>
            </div>
            <p style={s.balanceSub}>Available to spend at any partner</p>
            <div style={{ ...s.heroActions, flexWrap: 'wrap' }}>
              <button style={{ ...s.actionPrimary, flex: isMobile ? '1' : 'none' }} onClick={() => onNavigate('/businesses')}>
                Browse partners
              </button>
              <button style={{ ...s.actionSecondary, flex: isMobile ? '1' : 'none' }} onClick={() => onNavigate('/map')}>
                View map
              </button>
            </div>
          </div>

          {/* Transaction history */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Recent transactions</h2>
            {loading ? (
                <div style={s.skeletons}>
                  {[1, 2, 3, 4].map(i => <div key={i} style={s.skeleton} />)}
                </div>
            ) : history.length === 0 ? (
                <div style={s.empty}>
                  <p style={s.emptyTitle}>No transactions yet</p>
                  <p style={s.emptySub}>Visit any Veniar partner and give them your phone number at checkout to start earning Veniar Points.</p>
                </div>
            ) : (
                <div style={s.txList}>
                  {history.map(tx => (
                      <div key={tx.id} style={s.tx}>
                        <div style={{ ...s.txDot, background: tx.rnTransacted > 0 ? '#dcfce7' : '#fee2e2' }}>
                          <span style={{ color: tx.rnTransacted > 0 ? '#16a34a' : '#dc2626', fontSize: '14px', fontWeight: '700' }}>
                            {tx.rnTransacted > 0 ? '+' : '−'}
                          </span>
                        </div>
                        <div style={s.txMeta}>
                          <p style={s.txDesc}>{tx.description}</p>
                          <p style={s.txDate}>
                            {tx.dateTransacted
                                ? new Date(tx.dateTransacted).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                                : '—'}
                          </p>
                        </div>
                        <span style={{ ...s.txAmt, color: tx.rnTransacted > 0 ? '#16a34a' : '#dc2626' }}>
                          {tx.rnTransacted > 0 ? '+' : ''}{tx.rnTransacted} pts
                        </span>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

const s = {
  root: { minHeight: '100vh', background: 'var(--rn-bg)', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", position: 'relative', overflow: 'hidden' },
  orb1: { position: 'fixed', top: '-80px', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--rn-orb1)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' },
  orb2: { position: 'fixed', bottom: '-60px', left: '15%', width: '350px', height: '350px', borderRadius: '50%', background: 'var(--rn-orb2)', filter: 'blur(70px)', zIndex: 0, pointerEvents: 'none' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', background: 'var(--rn-nav-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--rn-nav-border)', position: 'sticky', top: 0, zIndex: 100 },
  navBrand: { color: 'var(--rn-text)', fontSize: '15px', fontWeight: '800', letterSpacing: '-0.01em', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' },
  navRight: { display: 'flex', alignItems: 'center', gap: '4px' },
  navLink: { background: 'none', border: 'none', color: 'var(--rn-text-sub)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', padding: '6px 8px', borderRadius: 0, fontFamily: 'inherit' },
  navLogout: { background: 'none', border: '1px solid var(--rn-ghost-border)', color: 'var(--rn-ghost-color)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: '6px 12px', borderRadius: 0, fontFamily: 'inherit' },
  body: { maxWidth: '720px', margin: '0 auto', boxSizing: 'border-box' },
  hero: { background: 'var(--rn-portal-surface)', border: '1px solid var(--rn-portal-border)', borderRadius: 0, marginBottom: '32px', boxShadow: 'none' },
  heroGreeting: { color: 'var(--rn-portal-text-sub)', fontSize: '14px', margin: '0 0 12px', fontWeight: '500' },
  balanceRow: { display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' },
  balanceNum: { color: 'var(--rn-portal-text)', fontWeight: '800', lineHeight: 1, letterSpacing: '-0.04em' },
  balancePts: { color: 'var(--amber)', fontSize: '16px', fontWeight: '600' },
  balanceSub: { color: 'var(--rn-portal-text-muted)', fontSize: '13px', margin: '0 0 28px' },
  heroActions: { display: 'flex', gap: '10px' },
  actionPrimary: { padding: '11px 22px', background: '#0B5CAD', color: '#FFFFFF', border: 'none', borderRadius: 0, fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s ease' },
  actionSecondary: { padding: '11px 22px', background: 'transparent', color: 'var(--rn-ghost-color)', border: '1.5px solid var(--rn-ghost-border)', borderRadius: 0, fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  section: {},
  sectionTitle: { color: 'var(--rn-text)', fontSize: '15px', fontWeight: '700', margin: '0 0 16px', letterSpacing: '-0.01em' },
  skeletons: { display: 'flex', flexDirection: 'column', gap: '8px' },
  skeleton: { height: '64px', borderRadius: 0, background: 'var(--rn-card-bg)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' },
  empty: { background: 'var(--rn-card-bg)', border: '1px solid var(--rn-card-border)', borderRadius: 0, padding: '40px 24px', textAlign: 'center' },
  emptyTitle: { color: 'var(--rn-text)', fontSize: '15px', fontWeight: '600', margin: '0 0 8px' },
  emptySub: { color: 'var(--rn-text-sub)', fontSize: '13px', lineHeight: 1.6, margin: 0, maxWidth: '340px', display: 'inline-block' },
  txList: { display: 'flex', flexDirection: 'column', gap: '2px' },
  tx: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'var(--rn-portal-surface)', borderRadius: 0, border: '1px solid var(--rn-portal-border)' },
  txDot: { width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txMeta: { flex: 1, minWidth: 0 },
  txDesc: { color: 'var(--rn-portal-text)', fontSize: '14px', fontWeight: '500', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  txDate: { color: 'var(--rn-portal-text-muted)', fontSize: '12px', margin: 0 },
  txAmt: { fontSize: '14px', fontWeight: '700', flexShrink: 0 },
};
