import { useState, useEffect } from 'react';
import { useIsMobile } from './useIsMobile';
import { API } from './config';

const ROYAL = 'var(--rosso)';

function AdminDashboard() {
  const isMobile = useIsMobile();
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [actionType, setActionType] = useState('success');
  const [acting, setActing] = useState(null);
  const [rejectNotes, setRejectNotes] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch(`${API}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.error || !data.token) {
        setError('Invalid credentials');
      } else {
        setToken(data.token);
      }
    } catch {
      setError('Could not connect to server');
    }
  };

  const auth = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const showMsg = (text, type = 'success') => {
    setActionMsg(text);
    setActionType(type);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/business-requests/pending`, { headers: auth });
      const data = await res.json();
      setPending(Array.isArray(data) ? data : []);
    } catch { }
    setLoading(false);
  };

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/businesses`, { headers: auth });
      const data = await res.json();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch { }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!token) return;
    if (tab === 'pending') fetchPending();
    if (tab === 'businesses') fetchBusinesses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tab]);

  const handleApprove = async (id) => {
    if (acting) return;
    setActing(id + '-approve');
    try {
      const res = await fetch(`${API}/business-requests/${id}/approve`, {
        method: 'POST', headers: auth,
        body: JSON.stringify({ reviewerNotes: 'Approved by admin' })
      });
      const data = await res.json();
      if (data.error) { showMsg(`Error: ${data.error}`, 'error'); }
      else { showMsg('Business approved and is now live.'); fetchPending(); }
    } catch { showMsg('Could not connect to server', 'error'); }
    setActing(null);
  };

  const handleReject = async (id) => {
    if (acting) return;
    setActing(id + '-reject');
    try {
      const notes = rejectNotes[id] || 'Does not meet requirements';
      await fetch(`${API}/business-requests/${id}/reject`, {
        method: 'POST', headers: auth,
        body: JSON.stringify({ reviewerNotes: notes })
      });
      showMsg('Business request rejected.');
      fetchPending();
    } catch { showMsg('Error rejecting request.', 'error'); }
    setActing(null);
  };

  const handleSuspend = async (id) => {
    if (!window.confirm('Suspend this business?')) return;
    try {
      await fetch(`${API}/business-requests/${id}/suspend`, {
        method: 'POST', headers: auth, body: JSON.stringify({ reason: 'Suspended by admin' })
      });
      showMsg('Business suspended.');
      fetchBusinesses();
    } catch { showMsg('Error suspending business.', 'error'); }
  };

  const handleTerminate = async (id) => {
    if (!window.confirm('Permanently terminate this business? This cannot be undone.')) return;
    try {
      await fetch(`${API}/business-requests/${id}/terminate`, {
        method: 'POST', headers: auth, body: JSON.stringify({ reason: 'Terminated by admin' })
      });
      showMsg('Business terminated.');
      fetchBusinesses();
    } catch { showMsg('Error terminating business.', 'error'); }
  };

  const openEdit = (biz) => {
    setEditingId(biz.id);
    setEditForm({
      category: biz.category || '',
      tags: biz.tags || '',
      priceRange: biz.priceRange || 0,
      rankScore: biz.rankScore || 0,
      featured: biz.featured || false,
      featuredUntil: biz.featuredUntil ? biz.featuredUntil.substring(0, 10) : '',
    });
  };

  const handleSaveDetails = async (id) => {
    try {
      const res = await fetch(`${API}/businesses/${id}/details`, {
        method: 'PUT',
        headers: auth,
        body: JSON.stringify({
          category: editForm.category || null,
          tags: editForm.tags || null,
          priceRange: parseInt(editForm.priceRange) || null,
        }),
      });
      const data = await res.json();
      if (data.error) showMsg(`Error: ${data.error}`, 'error');
      else { showMsg('Details saved.'); fetchBusinesses(); }
    } catch { showMsg('Error saving details.', 'error'); }
  };

  const handleSaveRank = async (id) => {
    try {
      const res = await fetch(`${API}/businesses/${id}/rank`, {
        method: 'PUT',
        headers: auth,
        body: JSON.stringify({
          rankScore: parseFloat(editForm.rankScore) || 0,
          featured: editForm.featured,
          featuredUntil: editForm.featuredUntil || null,
        }),
      });
      const data = await res.json();
      if (data.error) showMsg(`Error: ${data.error}`, 'error');
      else { showMsg('Ranking saved.'); fetchBusinesses(); }
    } catch { showMsg('Error saving ranking.', 'error'); }
  };

  if (!token) {
    return (
        <div style={s.loginContainer}>
          <div style={{ ...s.loginBox, width: isMobile ? '100%' : '400px', padding: isMobile ? '40px 24px' : '48px', borderRadius: 0, minHeight: isMobile ? '100vh' : 'auto', boxSizing: 'border-box', boxShadow: 'none' }}>
            <div style={s.loginHeader}>
              <span style={s.loginBadge}>ADMIN</span>
              <h1 style={s.loginTitle}>Veniar Admin</h1>
              <p style={s.loginSub}>Restricted access — authorized personnel only</p>
            </div>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email}
                   onChange={e => setEmail(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" value={password}
                   onChange={e => setPassword(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            {error && <p style={s.error}>{error}</p>}
            <button style={s.btn} onClick={handleLogin}>Sign In</button>
          </div>
        </div>
    );
  }

  const TABS = [
    { key: 'pending', label: 'Pending requests' },
    { key: 'businesses', label: 'All businesses' },
  ];

  return (
      <div style={s.container}>
        <div style={s.topBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={s.logo}>Veniar</span>
            <span style={s.adminBadge}>ADMIN</span>
          </div>
          <button style={s.logoutBtn} onClick={() => setToken(null)}>Sign Out</button>
        </div>

        {isMobile ? (
            <div style={s.mobileTabs}>
              {TABS.map(({ key, label }) => (
                  <button key={key} style={{ ...s.mobileTab, borderBottom: tab === key ? `2px solid ${ROYAL}` : '2px solid transparent', color: tab === key ? ROYAL : '#888', fontWeight: tab === key ? '700' : '400' }}
                          onClick={() => setTab(key)}>
                    {label}
                  </button>
              ))}
            </div>
        ) : null}

        <div style={{ ...s.body, flexDirection: isMobile ? 'column' : 'row' }}>
          {!isMobile && (
              <div style={s.sidebar}>
                {TABS.map(({ key, label }) => (
                    <button key={key}
                            style={{ ...s.navBtn, background: tab === key ? '#f0f4ff' : 'transparent', color: tab === key ? ROYAL : '#555', fontWeight: tab === key ? '700' : '400' }}
                            onClick={() => setTab(key)}>
                      {label}
                    </button>
                ))}
              </div>
          )}

          <div style={{ ...s.content, padding: isMobile ? '16px' : '28px 32px' }}>
            {actionMsg && (
                <div style={{ ...s.banner, background: actionType === 'error' ? '#fdeaea' : '#e8f4ed', color: actionType === 'error' ? '#c0392b' : '#2e7d52' }}>
                  {actionMsg}
                </div>
            )}

            {tab === 'pending' && (
                <>
                  <h2 style={s.pageTitle}>Pending Requests</h2>
                  {loading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[1, 2, 3].map(i => <div key={i} style={s.skeleton} />)}
                      </div>
                  ) : pending.length === 0 ? (
                      <div style={s.empty}><p style={{ color: '#888', margin: 0 }}>No pending requests — all clear.</p></div>
                  ) : (
                      pending.map(req => (
                          <div key={req.id} style={s.card}>
                            <div style={{ ...s.cardTop, flexDirection: isMobile ? 'column' : 'row' }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={s.cardTitle}>{req.businessName}</h3>
                                <p style={s.cardSub}>{req.contactEmail} · {req.contactPhone}</p>
                                {req.address && <p style={s.cardSub}>{req.address}</p>}
                                <div style={s.badgeRow}>
                                  {req.requestingPaidPartner && <span style={s.tag}>Featured Partner</span>}
                                  {req.requestingUniqueRewardsPoint && <span style={s.tag}>Custom Rewards</span>}
                                </div>
                                <p style={s.cardDate}>
                                  Submitted: {new Date(req.submittedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                </p>
                                <div style={s.rejectRow}>
                                  <input style={s.notesInput} placeholder="Rejection reason (optional)"
                                         value={rejectNotes[req.id] || ''}
                                         onChange={e => setRejectNotes({ ...rejectNotes, [req.id]: e.target.value })} />
                                </div>
                              </div>
                              <div style={{ ...s.actionBtns, flexDirection: isMobile ? 'row' : 'column', marginTop: isMobile ? '12px' : '0' }}>
                                <button style={{ ...s.approveBtn, opacity: acting === req.id + '-approve' ? 0.7 : 1, flex: isMobile ? 1 : 'none' }}
                                        onClick={() => handleApprove(req.id)} disabled={!!acting}>
                                  {acting === req.id + '-approve' ? 'Approving...' : 'Approve'}
                                </button>
                                <button style={{ ...s.rejectBtn, opacity: acting === req.id + '-reject' ? 0.7 : 1, flex: isMobile ? 1 : 'none' }}
                                        onClick={() => handleReject(req.id)} disabled={!!acting}>
                                  {acting === req.id + '-reject' ? 'Rejecting...' : 'Reject'}
                                </button>
                              </div>
                            </div>
                          </div>
                      ))
                  )}
                </>
            )}

            {tab === 'businesses' && (
                <>
                  <h2 style={s.pageTitle}>All Businesses ({businesses.length})</h2>
                  {loading ? (
                      <div style={s.bizGrid}>
                        {[1, 2, 3, 4].map(i => <div key={i} style={{ ...s.skeleton, height: '100px' }} />)}
                      </div>
                  ) : businesses.length === 0 ? (
                      <div style={s.empty}><p style={{ color: '#888', margin: 0 }}>No businesses yet.</p></div>
                  ) : (
                      <div style={{ ...s.bizGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {businesses.map(biz => (
                            <div key={biz.id} style={s.bizCard}>
                              <div style={s.bizCardRow}>
                                <div style={s.bizInitial}>{biz.name.charAt(0).toUpperCase()}</div>
                                <div style={s.bizInfo}>
                                  <p style={s.bizName}>{biz.name}</p>
                                  <p style={s.bizAddr}>{biz.address || 'No address'}</p>
                                  <div style={s.badgeRow}>
                                    {biz.featured && <span style={s.tag}>⭐ Featured</span>}
                                    {biz.paidPartner && <span style={s.tag}>Partner</span>}
                                    {biz.uniqueRewardsPoint && <span style={s.tag}>Custom Points</span>}
                                    {biz.category && <span style={s.tagPurple}>{biz.category}</span>}
                                    {biz.priceRange > 0 && <span style={s.tagGreen}>{'$'.repeat(biz.priceRange)}</span>}
                                  </div>
                                  <div style={s.bizActions}>
                                    <button style={s.suspendBtn} onClick={() => handleSuspend(biz.id)}>Suspend</button>
                                    <button style={s.terminateBtn} onClick={() => handleTerminate(biz.id)}>Terminate</button>
                                    <button style={s.editBtn} onClick={() => editingId === biz.id ? setEditingId(null) : openEdit(biz)}>
                                      {editingId === biz.id ? 'Close' : 'Edit'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {editingId === biz.id && (
                                  <div style={s.editPanel}>
                                    <div style={s.editSection}>
                                      <p style={s.editSectionTitle}>Profile Details</p>
                                      <div style={s.editRow}>
                                        <div style={s.editField}>
                                          <label style={s.editLabel}>Category</label>
                                          <select style={s.editSelect} value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                                            <option value="">— None —</option>
                                            <option value="food">Food & Drink</option>
                                            <option value="retail">Retail</option>
                                            <option value="services">Services</option>
                                            <option value="health">Health & Wellness</option>
                                            <option value="entertainment">Entertainment</option>
                                            <option value="travel">Travel</option>
                                            <option value="other">Other</option>
                                          </select>
                                        </div>
                                        <div style={s.editField}>
                                          <label style={s.editLabel}>Price Range</label>
                                          <select style={s.editSelect} value={editForm.priceRange} onChange={e => setEditForm({ ...editForm, priceRange: e.target.value })}>
                                            <option value={0}>— None —</option>
                                            <option value={1}>$ (Budget)</option>
                                            <option value={2}>$$ (Moderate)</option>
                                            <option value={3}>$$$ (Expensive)</option>
                                            <option value={4}>$$$$ (Very Expensive)</option>
                                          </select>
                                        </div>
                                      </div>
                                      <label style={s.editLabel}>Tags (comma-separated)</label>
                                      <input style={s.editInput} placeholder="e.g. coffee, wifi, vegan" value={editForm.tags} onChange={e => setEditForm({ ...editForm, tags: e.target.value })} />
                                      <button style={s.saveBtn} onClick={() => handleSaveDetails(biz.id)}>Save Details</button>
                                    </div>
                                    <div style={s.editSection}>
                                      <p style={s.editSectionTitle}>Ranking & Featured</p>
                                      <div style={s.editRow}>
                                        <div style={s.editField}>
                                          <label style={s.editLabel}>Rank Score</label>
                                          <input style={s.editInput} type="number" step="0.1" value={editForm.rankScore} onChange={e => setEditForm({ ...editForm, rankScore: e.target.value })} />
                                        </div>
                                        <div style={s.editField}>
                                          <label style={s.editLabel}>Featured Until</label>
                                          <input style={s.editInput} type="date" value={editForm.featuredUntil} onChange={e => setEditForm({ ...editForm, featuredUntil: e.target.value })} />
                                        </div>
                                      </div>
                                      <label style={{ ...s.editLabel, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}>
                                        <input type="checkbox" checked={editForm.featured} onChange={e => setEditForm({ ...editForm, featured: e.target.checked })} />
                                        Mark as Featured
                                      </label>
                                      <button style={s.saveBtn} onClick={() => handleSaveRank(biz.id)}>Save Ranking</button>
                                    </div>
                                  </div>
                              )}
                            </div>
                        ))}
                      </div>
                  )}
                </>
            )}
          </div>
        </div>
      </div>
  );
}

const s = {
  loginContainer: { minHeight: '100vh', background: 'var(--vn-bg, #FFF8EA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" },
  loginBox: { background: 'var(--vn-surface, #fff)', border: '1px solid var(--vn-line, var(--vn-card-border))' },
  loginHeader: { textAlign: 'center', marginBottom: '32px' },
  loginBadge: { background: 'var(--rosso)', color: '#FFF8EA', fontSize: '10px', fontWeight: '700', letterSpacing: '3px', padding: '4px 12px', borderRadius: 0 },
  loginTitle: { color: 'var(--vn-text)', fontSize: '1.6rem', fontWeight: 800, margin: '12px 0 4px 0', letterSpacing: '0.03em', textTransform: 'uppercase', fontFamily: "'Archivo', 'Inter', sans-serif" },
  loginSub: { color: 'var(--vn-text-sub)', fontSize: '13px', margin: 0 },
  label: { color: 'var(--vn-text-sub)', fontSize: '10px', fontWeight: '700', display: 'block', marginBottom: '7px', letterSpacing: '2px', textTransform: 'uppercase' },
  input: { padding: '13px 16px', borderRadius: 0, border: '1px solid var(--vn-line, var(--vn-card-border))', background: 'var(--vn-bg, #fafafa)', color: 'var(--vn-text)', fontSize: '14px', marginBottom: '16px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  btn: { padding: '14px', borderRadius: 0, border: 'none', background: ROYAL, color: '#FFF8EA', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', width: '100%' },
  error: { color: '#dc2626', fontSize: '13px', background: '#fff0f0', padding: '10px 14px', borderRadius: 0, border: '1px solid #ffd0d0', margin: '0 0 14px 0' },
  container: { minHeight: '100vh', background: '#F4F6FB', fontFamily: "'Segoe UI', system-ui, sans-serif", display: 'flex', flexDirection: 'column' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#fff', borderBottom: '1px solid #eee', boxShadow: 'none' },
  logo: { color: ROYAL, fontSize: '1.2rem', fontWeight: '800' },
  adminBadge: { background: 'var(--rosso)', color: '#FFF8EA', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', padding: '3px 10px', borderRadius: 0 },
  logoutBtn: { padding: '7px 14px', borderRadius: 0, border: '1.5px solid #e0e0e0', background: 'transparent', color: '#666', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  mobileTabs: { display: 'flex', background: '#fff', borderBottom: '1px solid #eee', paddingLeft: '0' },
  mobileTab: { flex: 1, padding: '12px 8px', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer', textAlign: 'center' },
  body: { display: 'flex', flex: 1 },
  sidebar: { width: '200px', background: '#fff', borderRight: '1px solid #eee', padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '4px' },
  navBtn: { padding: '10px 14px', borderRadius: 0, border: 'none', fontSize: '13px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s' },
  content: { flex: 1, overflowY: 'auto' },
  banner: { padding: '12px 16px', borderRadius: 0, fontSize: '13px', fontWeight: '600', marginBottom: '20px' },
  pageTitle: { color: '#111', fontSize: '1.2rem', fontWeight: '700', margin: '0 0 16px 0' },
  skeleton: { height: '140px', borderRadius: 0, marginBottom: '12px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' },
  empty: { background: '#fff', borderRadius: 0, padding: '48px', textAlign: 'center', border: '1px solid #eee' },
  card: { background: '#fff', borderRadius: 0, padding: '16px', border: '1px solid #eee', marginBottom: '14px', boxShadow: 'none' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' },
  cardTitle: { color: '#111', fontSize: '1rem', fontWeight: '700', margin: '0 0 4px 0' },
  cardSub: { color: '#888', fontSize: '12px', margin: '0 0 3px 0' },
  cardDate: { color: '#bbb', fontSize: '11px', margin: '8px 0 0 0' },
  badgeRow: { display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' },
  tag: { background: '#f0f4ff', color: ROYAL, fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: 0 },
  rejectRow: { marginTop: '12px' },
  notesInput: { padding: '8px 12px', borderRadius: 0, border: '1.5px solid #e0e0e0', background: '#fafafa', color: '#111', fontSize: '12px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  actionBtns: { display: 'flex', gap: '8px', flexShrink: 0 },
  approveBtn: { padding: '9px 16px', borderRadius: 0, border: 'none', background: '#2e7d52', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' },
  rejectBtn: { padding: '9px 16px', borderRadius: 0, border: 'none', background: '#c0392b', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' },
  bizGrid: { display: 'grid', gap: '14px' },
  bizCard: { background: '#fff', borderRadius: 0, padding: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '0' },
  bizCardRow: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  bizInitial: { width: '40px', height: '40px', borderRadius: 0, background: 'linear-gradient(135deg, #152a9e, #1e35b5)', color: '#fff', fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bizInfo: { flex: 1, minWidth: 0 },
  bizName: { color: '#111', fontSize: '13px', fontWeight: '700', margin: '0 0 3px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  bizAddr: { color: '#aaa', fontSize: '11px', margin: '0 0 6px 0' },
  bizActions: { display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' },
  suspendBtn: { padding: '5px 10px', borderRadius: 0, border: '1.5px solid #e0a020', background: 'transparent', color: '#e0a020', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  terminateBtn: { padding: '5px 10px', borderRadius: 0, border: '1.5px solid #c0392b', background: 'transparent', color: '#c0392b', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  editBtn: { padding: '5px 10px', borderRadius: 0, border: '1px solid var(--rosso)', background: 'transparent', color: 'var(--rosso)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  tagPurple: { background: '#f5f3ff', color: '#7c3aed', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: 0 },
  tagGreen: { background: '#f0fdf4', color: '#166534', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: 0 },
  editPanel: { borderTop: '1px solid #f0f0f0', marginTop: '12px', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '16px' },
  editSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  editSectionTitle: { color: '#555', fontSize: '11px', fontWeight: '700', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' },
  editRow: { display: 'flex', gap: '10px' },
  editField: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  editLabel: { color: '#666', fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' },
  editSelect: { padding: '7px 10px', borderRadius: 0, border: '1.5px solid #e0e0e0', background: '#fafafa', color: '#111', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  editInput: { padding: '7px 10px', borderRadius: 0, border: '1.5px solid #e0e0e0', background: '#fafafa', color: '#111', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: '2px' },
  saveBtn: { padding: '7px 14px', borderRadius: 0, border: 'none', background: ROYAL, color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', alignSelf: 'flex-start' },
};

export default AdminDashboard;