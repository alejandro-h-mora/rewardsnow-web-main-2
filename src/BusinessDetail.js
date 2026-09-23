import { useEffect, useState } from 'react';
import { API } from './config';
import { useIsMobile } from './useIsMobile';

const BLUE = 'var(--rosso)';

const CATEGORY_LABELS = {
  RESTAURANT: 'Restaurant', CAFE: 'Café', RETAIL: 'Retail', FITNESS: 'Fitness',
  BEAUTY_SPA: 'Beauty & Spa', ENTERTAINMENT: 'Entertainment', GROCERY: 'Grocery',
  HEALTH: 'Health', AUTOMOTIVE: 'Automotive', SERVICES: 'Services', OTHER: 'Other',
};
const PRICE_LABELS = { BUDGET: '$', MODERATE: '$$', PREMIUM: '$$$' };

const scoreColor = n => n >= 80 ? '#16a34a' : n >= 60 ? '#d97706' : '#2563eb';
const scoreBg   = n => n >= 80 ? '#f0fdf4' : n >= 60 ? '#fffbeb' : '#eff6ff';

export default function BusinessDetail({ business, customer, onBack, onLogout, onRefresh }) {
  const isMobile = useIsMobile();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [redeeming, setRedeeming] = useState(null);
  const [compatibility, setCompatibility] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);

  useEffect(() => {
    fetch(`${API}/businesses/${business.id}/services`)
      .then(r => r.json())
      .then(d => setServices(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [business.id]);

  useEffect(() => {
    if (!customer?.token) return;
    const h = { Authorization: `Bearer ${customer.token}` };
    fetch(`${API}/businesses/${business.id}`, { headers: h })
      .then(r => r.json())
      .then(d => { if (d?.compatibility) setCompatibility(d.compatibility); })
      .catch(() => {});
    fetch(`${API}/ai/compatibility?businessId=${business.id}`, { headers: h })
      .then(r => r.status === 503 ? null : r.json())
      .then(d => {
        if (!d?.insight) return;
        try { setAiInsight(JSON.parse(d.insight)); } catch {}
      })
      .catch(() => {});
  }, [business.id, customer?.token]);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleRedeem = async service => {
    if (redeeming) return;
    setRedeeming(service.id);
    try {
      const res = await fetch(`${API}/ledger/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customer.token}`,
          'Idempotency-Key': `redeem-${service.id}-${Date.now()}`,
        },
        body: JSON.stringify({
          businessId: business.id,
          rnTransacted: service.rewardsCost,
          description: `Redeemed: ${service.name} at ${business.name}`,
        }),
      });
      const data = await res.json();
      if (data.error) flash(data.error, 'error');
      else { flash(`Redeemed! New balance: ${data.newBalance} pts`); onRefresh?.(); }
    } catch {
      flash('Could not connect. Try again.', 'error');
    } finally {
      setRedeeming(null);
    }
  };

  const openDirections = () => {
    if (!business.address) return;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address)}`, '_blank');
  };

  const tags = business.tags ? business.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div style={s.root}>
      <nav style={{ ...s.nav, padding: isMobile ? '0 16px' : '0 40px' }}>
        <div style={s.navLeft}>
          <button style={s.backBtn} onClick={onBack}>← Back</button>
          {!isMobile && <span style={s.navBrand}>Veniar</span>}
        </div>
        <button style={s.navLogout} onClick={onLogout}>Sign out</button>
      </nav>

      <div style={{ ...s.body, padding: isMobile ? '20px 16px' : '40px 24px' }}>
        {/* Business header */}
        <div style={{ ...s.bizHeader, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : '20px' }}>
          <div style={{ ...s.avatar, width: isMobile ? '52px' : '64px', height: isMobile ? '52px' : '64px', fontSize: isMobile ? '1.3rem' : '1.6rem' }}>
            {business.name.charAt(0).toUpperCase()}
          </div>
          <div style={s.bizInfo}>
            <div style={s.bizNameRow}>
              <h1 style={{ ...s.bizName, fontSize: isMobile ? '1.2rem' : '1.4rem' }}>{business.name}</h1>
              {business.featured && <span style={s.featuredTag}>⭐ Featured</span>}
              {business.paidPartner && !business.featured && <span style={s.featuredTag}>Partner</span>}
            </div>
            {business.address && <p style={s.bizAddr}>{business.address}</p>}
            <div style={s.bizMeta}>
              {business.category && (
                <span style={s.categoryTag}>{CATEGORY_LABELS[business.category] || business.category}</span>
              )}
              {business.priceRange && (
                <span style={s.priceTag}>{PRICE_LABELS[business.priceRange] || business.priceRange}</span>
              )}
              <span style={{ ...s.typeTag, ...(business.uniqueRewardsPoint ? s.typeTagCustom : {}) }}>
                {business.uniqueRewardsPoint ? 'Custom rewards' : 'Veniar Points'}
              </span>
              {business.address && (
                <button style={s.directionsBtn} onClick={openDirections}>Get directions →</button>
              )}
            </div>
            {tags.length > 0 && (
              <div style={s.tagsRow}>
                {tags.map(tag => (
                  <span key={tag} style={s.tagChip}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compatibility score */}
        {compatibility && (
          <div style={s.compatCard}>
            <div style={s.compatHeader}>
              <div style={{ ...s.compatScore, color: scoreColor(compatibility.score), background: scoreBg(compatibility.score) }}>
                {compatibility.score}% match
              </div>
              <p style={s.compatTitle}>How well this fits you</p>
            </div>
            {compatibility.matchReasons?.length > 0 && (
              <ul style={s.reasonList}>
                {compatibility.matchReasons.map((r, i) => (
                  <li key={i} style={s.reasonItem}>{r}</li>
                ))}
              </ul>
            )}
            {compatibility.matchedTags?.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                {compatibility.matchedTags.map(t => (
                  <span key={t} style={s.matchedTag}>{t}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI insight */}
        {aiInsight?.explanation && (
          <div style={s.aiCard}>
            <div style={s.aiCardHeader}>
              <span style={s.aiIcon}>✦</span>
              <span style={s.aiTitle}>Why this matches you</span>
            </div>
            <p style={s.aiExplanation}>{aiInsight.explanation}</p>
            {aiInsight.keyFactors?.length > 0 && (
              <div style={s.keyFactors}>
                {aiInsight.keyFactors.map((f, i) => (
                  <span key={i} style={s.keyFactor}>{f}</span>
                ))}
              </div>
            )}
            {aiInsight.tip && <p style={s.aiTip}>💡 {aiInsight.tip}</p>}
          </div>
        )}

        {/* Flash */}
        {msg && (
          <div style={{ ...s.flash, ...(msg.type === 'error' ? s.flashError : s.flashSuccess) }}>
            {msg.text}
          </div>
        )}

        {/* Services */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Services & rewards</h2>
          {loading ? (
            <div style={{ ...s.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {[1, 2, 3].map(i => <div key={i} style={s.skeleton} />)}
            </div>
          ) : services.length === 0 ? (
            <div style={s.empty}>
              <p style={s.emptyTitle}>No services listed yet</p>
              <p style={s.emptySub}>Check back soon — this business is still setting up their rewards.</p>
            </div>
          ) : (
            <div style={{ ...s.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {services.map(svc => (
                <div key={svc.id} style={s.card}>
                  <div style={s.cardTop}>
                    <h3 style={s.svcName}>{svc.name}</h3>
                    <span style={s.earnPill}>+{svc.rewardsGrant} pts</span>
                  </div>
                  {svc.description && <p style={s.svcDesc}>{svc.description}</p>}
                  <div style={s.cardBottom}>
                    <div>
                      <p style={s.redeemLabel}>Redeem for</p>
                      <p style={s.redeemCost}>{svc.rewardsCost} pts</p>
                    </div>
                    <button
                      style={{ ...s.redeemBtn, opacity: redeeming ? 0.6 : 1, cursor: redeeming ? 'not-allowed' : 'pointer' }}
                      onClick={() => handleRedeem(svc)}
                      disabled={!!redeeming}
                    >
                      {redeeming === svc.id ? 'Redeeming…' : 'Redeem'}
                    </button>
                  </div>
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
  root: { minHeight: '100vh', background: 'var(--rn-bg)', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', background: 'var(--rn-nav-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--rn-nav-border)', position: 'sticky', top: 0, zIndex: 100 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  backBtn: { background: 'none', border: '1px solid var(--rn-outline-btn-border)', color: 'var(--rn-outline-btn-color)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: '6px 12px', borderRadius: 0 },
  navBrand: { color: 'var(--rn-text)', fontSize: '15px', fontWeight: '700' },
  navLogout: { background: 'none', border: '1px solid var(--rn-outline-btn-border)', color: 'var(--rn-outline-btn-color)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: '6px 14px', borderRadius: 0 },
  body: { maxWidth: '900px', margin: '0 auto', boxSizing: 'border-box' },
  bizHeader: { display: 'flex', alignItems: 'flex-start', marginBottom: '24px' },
  avatar: { borderRadius: 0, background: 'var(--rosso)', color: '#FFF8EA', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bizInfo: { flex: 1, minWidth: '200px' },
  bizNameRow: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' },
  bizName: { color: 'var(--rn-text)', fontWeight: '700', margin: 0, letterSpacing: '-0.02em' },
  featuredTag: { background: '#fffbeb', color: '#92400e', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: 0, border: '1px solid #fde68a' },
  bizAddr: { color: 'var(--rn-text-sub)', fontSize: '13px', margin: '0 0 10px' },
  bizMeta: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' },
  categoryTag: { background: '#eff6ff', color: BLUE, fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: 0 },
  priceTag: { background: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: 0, letterSpacing: '0.05em' },
  typeTag: { background: 'var(--rn-card-bg)', color: 'var(--rn-text-muted)', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: 0, border: '1px solid var(--rn-card-border)' },
  typeTagCustom: { background: '#f5f3ff', color: '#7c3aed', border: '1px solid #e9d5ff' },
  directionsBtn: { background: 'none', border: '1px solid var(--rn-outline-btn-border)', color: 'var(--rn-outline-btn-color)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', padding: '3px 10px', borderRadius: 0 },
  tagsRow: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  tagChip: { background: 'var(--rn-card-bg)', color: 'var(--rn-text-muted)', fontSize: '11px', fontWeight: '500', padding: '2px 8px', borderRadius: 0, border: '1px solid var(--rn-card-border)' },
  compatCard: { background: '#fff', border: '1.5px solid #bfdbfe', borderRadius: 0, padding: '18px', marginBottom: '20px', boxShadow: 'none' },
  compatHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  compatScore: { fontSize: '13px', fontWeight: '800', padding: '4px 12px', borderRadius: 0 },
  compatTitle: { color: '#374151', fontSize: '13px', fontWeight: '600', margin: 0 },
  reasonList: { margin: '0', padding: '0 0 0 16px' },
  reasonItem: { color: '#4b5563', fontSize: '13px', lineHeight: 1.6, marginBottom: '2px' },
  matchedTag: { background: 'var(--vn-surface)', color: 'var(--rosso)', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: 0 },
  aiCard: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 0, padding: '18px', marginBottom: '20px' },
  aiCardHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' },
  aiIcon: { color: '#a5b4fc', fontSize: '14px' },
  aiTitle: { color: '#e0e7ff', fontSize: '13px', fontWeight: '700' },
  aiExplanation: { color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 12px' },
  keyFactors: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' },
  keyFactor: { background: 'rgba(165,180,252,0.2)', color: '#a5b4fc', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: 0, border: '1px solid rgba(165,180,252,0.3)' },
  aiTip: { color: 'rgba(255,255,255,0.65)', fontSize: '12px', margin: 0, fontStyle: 'italic' },
  flash: { borderRadius: 0, padding: '12px 16px', fontSize: '13px', fontWeight: '500', marginBottom: '24px' },
  flashSuccess: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  flashError: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
  section: {},
  sectionTitle: { color: 'var(--rn-text)', fontSize: '15px', fontWeight: '700', margin: '0 0 16px', letterSpacing: '-0.01em' },
  grid: { display: 'grid', gap: '14px' },
  skeleton: { height: '160px', borderRadius: 0, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 0, padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' },
  svcName: { color: '#0a0a0a', fontSize: '14px', fontWeight: '600', margin: 0, flex: 1 },
  earnPill: { background: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: 0, flexShrink: 0 },
  svcDesc: { color: '#6b7280', fontSize: '13px', margin: 0, lineHeight: 1.5, flex: 1 },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f0f0f0', marginTop: 'auto' },
  redeemLabel: { color: '#9ca3af', fontSize: '11px', fontWeight: '500', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  redeemCost: { color: BLUE, fontSize: '15px', fontWeight: '700', margin: 0 },
  redeemBtn: { background: BLUE, color: '#fff', border: 'none', borderRadius: 0, fontSize: '13px', fontWeight: '600', padding: '8px 16px' },
  empty: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 0, padding: '48px 24px', textAlign: 'center' },
  emptyTitle: { color: '#374151', fontSize: '15px', fontWeight: '600', margin: '0 0 8px' },
  emptySub: { color: '#9ca3af', fontSize: '13px', lineHeight: 1.6, margin: 0 },
};
