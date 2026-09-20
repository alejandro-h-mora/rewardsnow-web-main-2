import { useEffect, useState, useCallback } from 'react';
import { API } from './config';
import { useIsMobile } from './useIsMobile';

const BLUE = 'var(--rosso)';

const CATEGORY_LABELS = {
  food: 'Food & Drink',
  retail: 'Retail',
  services: 'Services',
  health: 'Health & Wellness',
  entertainment: 'Entertainment',
  travel: 'Travel',
  other: 'Other',
};

const PRICE_SYMBOLS = ['', '$', '$$', '$$$', '$$$$'];

export default function BusinessList({ customer, onLogout, onSelectBusiness, onNavigate }) {
  const isMobile = useIsMobile();
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch(`${API}/businesses`);
      const data = await res.json();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSearch = async e => {
    const q = e.target.value;
    setSearch(q);
    if (aiMode) return;
    if (!q) { fetchAll(); setAiSummary(''); return; }
    if (q.length < 2) return;
    setSearching(true);
    try {
      const res = await fetch(`${API}/businesses/search?name=${encodeURIComponent(q)}`);
      const data = await res.json();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const handleAiSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    setAiSummary('');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (customer?.token) headers['Authorization'] = `Bearer ${customer.token}`;
      const res = await fetch(`${API}/ai/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: search }),
      });
      if (res.status === 503) { setSearching(false); return; }
      const data = await res.json();
      if (!data?.result) { setSearching(false); return; }
      let parsed;
      try { parsed = JSON.parse(data.result); } catch { setSearching(false); return; }
      const { rankedIds, summary } = parsed;
      if (summary) setAiSummary(summary);
      if (Array.isArray(rankedIds) && rankedIds.length > 0) {
        const allRes = await fetch(`${API}/businesses`);
        const all = await allRes.json();
        if (Array.isArray(all)) {
          const idOrder = rankedIds.map(String);
          const ordered = [...all].sort((a, b) => {
            const ai = idOrder.indexOf(String(a.id));
            const bi = idOrder.indexOf(String(b.id));
            if (ai === -1 && bi === -1) return 0;
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
          });
          setBusinesses(ordered);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    setAiSummary('');
    fetchAll();
  };

  const toggleAiMode = () => {
    setAiMode(m => !m);
    setSearch('');
    setAiSummary('');
    fetchAll();
  };

  return (
      <div style={s.root}>
        <div style={s.orb1} />
        <div style={s.orb2} />

        <nav style={{ ...s.nav, padding: isMobile ? '0 16px' : '0 40px' }}>
          <button style={s.navBrand} onClick={() => onNavigate('/home')}>Veniar</button>
          <div style={s.navRight}>
            <button style={s.navLink} onClick={() => onNavigate('/home')}>Home</button>
            <button style={s.navLink} onClick={() => onNavigate('/map')}>Map</button>
            <button style={s.navLogout} onClick={onLogout}>Sign out</button>
          </div>
        </nav>

        <div style={{ ...s.body, padding: isMobile ? '20px 16px' : '40px 24px' }}>
          <div style={s.header}>
            <div>
              <h1 style={{ ...s.title, fontSize: isMobile ? '1.3rem' : '1.5rem' }}>Partner businesses</h1>
              <p style={s.subtitle}>
                {aiSummary || 'Earn points at every location below'}
              </p>
            </div>
          </div>

          <div style={s.searchWrap}>
            <span style={s.searchIcon}>⌕</span>
            <input
                style={s.searchInput}
                type="text"
                placeholder={aiMode ? "Describe what you're looking for…" : 'Search businesses…'}
                value={search}
                onChange={handleSearch}
                onKeyDown={e => aiMode && e.key === 'Enter' && handleAiSearch()}
                autoComplete="off"
            />
            {searching && <span style={s.searchSpinner}>{aiMode ? 'AI searching…' : 'Searching…'}</span>}
            {aiMode && !searching && search && (
                <button style={s.aiSearchBtn} onClick={handleAiSearch}>Search</button>
            )}
            {search && !searching && (
                <button style={s.clearBtn} onClick={clearSearch}>Clear</button>
            )}
            <button
                style={{ ...s.aiToggleBtn, ...(aiMode ? s.aiToggleBtnActive : {}) }}
                onClick={toggleAiMode}
                title="Toggle AI natural language search"
            >
              AI
            </button>
          </div>

          {loading ? (
              <div style={{ ...s.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={s.skeleton} />)}
              </div>
          ) : businesses.length === 0 ? (
              <div style={s.empty}>
                <p style={s.emptyTitle}>No businesses found</p>
                {search && <button style={s.emptyAction} onClick={clearSearch}>Clear search</button>}
              </div>
          ) : (
              <div style={{ ...s.grid, gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {businesses.map(biz => (
                    <div key={biz.id}
                         style={{ ...s.card, ...(biz.featured ? s.cardFeatured : {}) }}
                         onClick={() => onSelectBusiness(biz)}>
                      <div style={s.cardHeader}>
                        <div style={s.avatar}>{biz.name.charAt(0).toUpperCase()}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          {biz.featured
                              ? <span style={s.featuredTag}>⭐ Featured</span>
                              : biz.paidPartner
                                  ? <span style={s.featuredTag}>Featured</span>
                                  : null}
                          {biz.priceRange > 0 && (
                              <span style={s.priceTag}>{PRICE_SYMBOLS[biz.priceRange] || ''}</span>
                          )}
                        </div>
                      </div>
                      <h3 style={{ ...s.bizName, fontSize: isMobile ? '14px' : '15px' }}>{biz.name}</h3>
                      <p style={s.bizAddr}>{biz.address || 'Address not listed'}</p>
                      <div style={s.cardFooter}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', flex: 1 }}>
                          {biz.category && (
                              <span style={s.categoryTag}>{CATEGORY_LABELS[biz.category] || biz.category}</span>
                          )}
                          <span style={{ ...s.typeTag, ...(biz.uniqueRewardsPoint ? s.typeTagCustom : {}) }}>
                            {biz.uniqueRewardsPoint ? 'Custom' : 'Veniar Points'}
                          </span>
                        </div>
                        <span style={s.arrow}>→</span>
                      </div>
                      {biz.tags && (
                          <div style={s.tagsRow}>
                            {biz.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 3).map(t => (
                                <span key={t} style={s.tagChip}>{t}</span>
                            ))}
                          </div>
                      )}
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}

const s = {
  root: { minHeight: '100vh', background: 'var(--rn-bg)', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", position: 'relative', overflow: 'hidden' },
  orb1: { position: 'fixed', top: '-80px', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--rn-orb1)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' },
  orb2: { position: 'fixed', bottom: '-60px', left: '15%', width: '350px', height: '350px', borderRadius: '50%', background: 'var(--rn-orb2)', filter: 'blur(70px)', zIndex: 0, pointerEvents: 'none' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', background: 'var(--rn-nav-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--rn-nav-border)', position: 'sticky', top: 0, zIndex: 100 },
  navBrand: { color: '#f59e0b', fontSize: '15px', fontWeight: '800', letterSpacing: '-0.01em', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' },
  navRight: { display: 'flex', alignItems: 'center', gap: '4px' },
  navLink: { background: 'none', border: 'none', color: 'var(--rn-text-sub)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', padding: '6px 8px', borderRadius: 0, fontFamily: 'inherit' },
  navLogout: { background: 'none', border: '1px solid var(--rn-ghost-border)', color: 'var(--rn-ghost-color)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: '6px 12px', borderRadius: 0, fontFamily: 'inherit' },
  body: { maxWidth: '1100px', margin: '0 auto', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' },
  title: { color: 'var(--rn-text)', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.02em' },
  subtitle: { color: 'var(--rn-text-sub)', fontSize: '14px', margin: 0 },
  searchWrap: { position: 'relative', display: 'flex', alignItems: 'center', background: '#fff', border: 'none', borderRadius: 0, padding: '0 14px', marginBottom: '20px', gap: '8px', boxShadow: 'none' },
  searchIcon: { color: '#60a5fa', fontSize: '18px', lineHeight: 1 },
  searchInput: { flex: 1, border: 'none', outline: 'none', padding: '11px 0', fontSize: '14px', color: '#0f172a', background: 'transparent' },
  searchSpinner: { color: '#9ca3af', fontSize: '12px', whiteSpace: 'nowrap' },
  clearBtn: { background: 'none', border: 'none', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', padding: '4px 8px', borderRadius: 0, fontFamily: 'inherit' },
  aiSearchBtn: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: '5px 10px', borderRadius: 0, fontFamily: 'inherit', whiteSpace: 'nowrap' },
  aiToggleBtn: { background: 'none', border: '1.5px solid #d1d5db', color: '#9ca3af', fontSize: '11px', fontWeight: '700', cursor: 'pointer', padding: '4px 8px', borderRadius: 0, fontFamily: 'inherit', letterSpacing: '0.05em', flexShrink: 0 },
  aiToggleBtnActive: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: '1.5px solid transparent', color: '#fff' },
  grid: { display: 'grid', gap: '12px' },
  skeleton: { height: '180px', borderRadius: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.07) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' },
  card: { background: '#fff', border: '2px solid transparent', borderRadius: 0, padding: '16px', cursor: 'pointer', transition: 'box-shadow 0.15s', boxShadow: 'none' },
  cardFeatured: { border: '2px solid #f59e0b', boxShadow: 'none' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: 0, background: 'var(--rosso)', color: '#FFF8EA', fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  featuredTag: { background: '#fffbeb', color: '#92400e', fontSize: '10px', fontWeight: '600', padding: '3px 6px', borderRadius: 0, border: '1px solid #fde68a' },
  priceTag: { background: '#f0fdf4', color: '#166534', fontSize: '11px', fontWeight: '700', padding: '2px 6px', borderRadius: 0 },
  bizName: { color: '#0f172a', fontWeight: '700', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  bizAddr: { color: '#9ca3af', fontSize: '12px', margin: '0 0 12px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  typeTag: { background: '#eff6ff', color: BLUE, fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: 0 },
  typeTagCustom: { background: '#fef3c7', color: '#b45309' },
  categoryTag: { background: '#f5f3ff', color: '#7c3aed', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: 0 },
  tagsRow: { display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' },
  tagChip: { background: '#f1f5f9', color: '#475569', fontSize: '10px', padding: '2px 6px', borderRadius: 0 },
  arrow: { color: '#60a5fa', fontSize: '14px' },
  empty: { background: 'var(--rn-card-bg)', border: '1px solid var(--rn-card-border)', borderRadius: 0, padding: '60px 24px', textAlign: 'center' },
  emptyTitle: { color: 'var(--rn-text)', fontSize: '15px', fontWeight: '600', margin: '0 0 12px' },
  emptyAction: { background: 'none', border: '1px solid var(--rn-ghost-border)', color: 'var(--rn-ghost-color)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: '8px 16px', borderRadius: 0, fontFamily: 'inherit' },
};
