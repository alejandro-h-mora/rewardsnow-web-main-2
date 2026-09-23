import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from './useIsMobile';
import { API } from './config';

const ROYAL = 'var(--rosso)';

function BusinessOwnerDashboard() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [account, setAccount] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [saving, setSaving] = useState(false);

  const [settingsProfile, setSettingsProfile] = useState({ firstName: '', lastName: '', email: '' });
  const [settingsProfileSaving, setSettingsProfileSaving] = useState(false);
  const [settingsProfileMsg, setSettingsProfileMsg] = useState({ text: '', type: '' });
  const [settingsPw, setSettingsPw] = useState({ current: '', next: '', confirm: '' });
  const [settingsPwSaving, setSettingsPwSaving] = useState(false);
  const [settingsPwMsg, setSettingsPwMsg] = useState({ text: '', type: '' });

  const [empForm, setEmpForm] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'STAFF' });
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [svcForm, setSvcForm] = useState({ name: '', description: '', rewardsCost: '', rewardsGrant: '' });
  const [showSvcForm, setShowSvcForm] = useState(false);
  const [editingSvc, setEditingSvc] = useState(null);

  const [offers, setOffers] = useState([]);
  const [settlement, setSettlement] = useState(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [offerForm, setOfferForm] = useState({
    type: 'bonus_multiplier', name: '', multiplier: '2', bonusPoints: '50',
    daysToReturn: '14', dayOfWeek: '', startTime: '', endTime: '', isActive: true,
  });

  const showMsg = (text, type = 'success') => {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(''), 4000);
  };

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch(`${API}/business-accounts/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.error || !data.token) { setError('Invalid credentials'); return; }
      setToken(data.token);
      const meRes = await fetch(`${API}/business-accounts/me`, {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      const meData = await meRes.json();
      setAccount(meData);
      setSettingsProfile({ firstName: meData.firstName || '', lastName: meData.lastName || '', email: meData.email || '' });
    } catch { setError('Could not connect to server'); }
  };

  const auth = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/employees`, { headers: auth });
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch { }
    setLoading(false);
  };

  const fetchServices = async () => {
    if (!account?.businessId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/businesses/${account.businessId}/services`);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch { }
    setLoading(false);
  };

  const fetchStats = async () => {
    if (!account?.businessId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/businesses/${account.businessId}/stats`, { headers: auth });
      setStats(await res.json());
    } catch { }
    setLoading(false);
  };

  const fetchOffers = async () => {
    if (!account?.businessId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/businesses/${account.businessId}/offers`, { headers: auth });
      if (res.ok) { const d = await res.json(); setOffers(Array.isArray(d) ? d : []); }
    } catch {}
    setLoading(false);
  };

  const fetchSettlement = async () => {
    if (!account?.businessId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/businesses/${account.businessId}/settlement`, { headers: auth });
      if (res.ok) setSettlement(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!token || !account) return;
    if (tab === 'employees') fetchEmployees();
    if (tab === 'services') fetchServices();
    if (tab === 'stats') fetchStats();
    if (tab === 'offers') fetchOffers();
    if (tab === 'settlement') fetchSettlement();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, account, tab]);

  const handleAddEmployee = async () => {
    if (saving) return;
    if (!empForm.firstName || !empForm.lastName || !empForm.email || !empForm.password) {
      showMsg('Fill in all employee fields', 'error'); return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/employees`, {
        method: 'POST', headers: auth, body: JSON.stringify(empForm)
      });
      const data = await res.json();
      if (data.error) { showMsg(`Error: ${data.error}`, 'error'); return; }
      showMsg('Employee added.');
      setShowEmpForm(false);
      setEmpForm({ email: '', password: '', firstName: '', lastName: '', role: 'STAFF' });
      fetchEmployees();
    } catch { showMsg('Could not add employee.', 'error'); }
    setSaving(false);
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this employee?')) return;
    try {
      await fetch(`${API}/employees/${id}`, { method: 'DELETE', headers: auth });
      showMsg('Employee deactivated.');
      fetchEmployees();
    } catch { showMsg('Error deactivating employee.', 'error'); }
  };

  const handleSaveService = async () => {
    if (saving) return;
    if (!account?.businessId) { showMsg('Business not approved yet.', 'error'); return; }
    if (!svcForm.name) { showMsg('Service name is required', 'error'); return; }
    setSaving(true);
    try {
      const payload = { name: svcForm.name, description: svcForm.description, rewardsCost: parseInt(svcForm.rewardsCost) || 0, rewardsGrant: parseInt(svcForm.rewardsGrant) || 0 };
      const url = editingSvc
          ? `${API}/businesses/${account.businessId}/services/${editingSvc}`
          : `${API}/businesses/${account.businessId}/services`;
      const res = await fetch(url, { method: editingSvc ? 'PUT' : 'POST', headers: auth, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.error) { showMsg(`Error: ${data.error}`, 'error'); return; }
      showMsg(editingSvc ? 'Service updated.' : 'Service added.');
      setShowSvcForm(false); setEditingSvc(null);
      setSvcForm({ name: '', description: '', rewardsCost: '', rewardsGrant: '' });
      fetchServices();
    } catch { showMsg('Could not save service.', 'error'); }
    setSaving(false);
  };

  const handleEditService = (svc) => {
    setEditingSvc(svc.id);
    setSvcForm({ name: svc.name, description: svc.description, rewardsCost: svc.rewardsCost, rewardsGrant: svc.rewardsGrant });
    setShowSvcForm(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await fetch(`${API}/businesses/${account.businessId}/services/${id}`, { method: 'DELETE', headers: auth });
      showMsg('Service deleted.');
      fetchServices();
    } catch { showMsg('Could not delete service.', 'error'); }
  };

  const handleSaveOffer = async () => {
    if (saving || !account?.businessId) return;
    if (!offerForm.name.trim()) { showMsg('Offer name is required', 'error'); return; }
    setSaving(true);
    try {
      const url = editingOffer
        ? `${API}/businesses/${account.businessId}/offers/${editingOffer}`
        : `${API}/businesses/${account.businessId}/offers`;
      const res = await fetch(url, { method: editingOffer ? 'PUT' : 'POST', headers: auth, body: JSON.stringify(offerForm) });
      const data = await res.json();
      if (data.error) { showMsg(`Error: ${data.error}`, 'error'); }
      else {
        showMsg(editingOffer ? 'Offer updated.' : 'Offer created.');
        setShowOfferForm(false); setEditingOffer(null);
        setOfferForm({ type: 'bonus_multiplier', name: '', multiplier: '2', bonusPoints: '50', daysToReturn: '14', dayOfWeek: '', startTime: '', endTime: '', isActive: true });
        fetchOffers();
      }
    } catch { showMsg('Could not save offer.', 'error'); }
    setSaving(false);
  };

  const handleToggleOffer = async (offer) => {
    try {
      await fetch(`${API}/businesses/${account.businessId}/offers/${offer.id}`, {
        method: 'PUT', headers: auth, body: JSON.stringify({ ...offer, isActive: !offer.isActive })
      });
      fetchOffers();
    } catch {}
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Delete this offer?')) return;
    try {
      await fetch(`${API}/businesses/${account.businessId}/offers/${id}`, { method: 'DELETE', headers: auth });
      showMsg('Offer deleted.'); fetchOffers();
    } catch { showMsg('Could not delete offer.', 'error'); }
  };

  const handleSettingsProfileSave = async () => {
    if (settingsProfileSaving) return;
    setSettingsProfileSaving(true);
    setSettingsProfileMsg({ text: '', type: '' });
    try {
      const res = await fetch(`${API}/business-accounts/me`, {
        method: 'PATCH', headers: auth,
        body: JSON.stringify(settingsProfile),
      });
      const data = await res.json();
      if (data.error) {
        setSettingsProfileMsg({ text: data.error, type: 'error' });
      } else {
        setSettingsProfileMsg({ text: 'Profile updated.', type: 'success' });
        setAccount(prev => ({ ...prev, ...settingsProfile }));
      }
    } catch {
      setSettingsProfileMsg({ text: 'Could not connect.', type: 'error' });
    }
    setSettingsProfileSaving(false);
  };

  const handleSettingsPwSave = async () => {
    if (settingsPwSaving) return;
    if (!settingsPw.current) { setSettingsPwMsg({ text: 'Enter your current password.', type: 'error' }); return; }
    if (settingsPw.next.length < 8) { setSettingsPwMsg({ text: 'New password must be at least 8 characters.', type: 'error' }); return; }
    if (settingsPw.next !== settingsPw.confirm) { setSettingsPwMsg({ text: 'Passwords do not match.', type: 'error' }); return; }
    setSettingsPwSaving(true);
    setSettingsPwMsg({ text: '', type: '' });
    try {
      const res = await fetch(`${API}/business-accounts/change-password`, {
        method: 'POST', headers: auth,
        body: JSON.stringify({ currentPassword: settingsPw.current, newPassword: settingsPw.next }),
      });
      const data = await res.json();
      if (data.error) {
        setSettingsPwMsg({ text: data.error, type: 'error' });
      } else {
        setSettingsPwMsg({ text: 'Password updated.', type: 'success' });
        setSettingsPw({ current: '', next: '', confirm: '' });
      }
    } catch {
      setSettingsPwMsg({ text: 'Could not connect.', type: 'error' });
    }
    setSettingsPwSaving(false);
  };

  const Skeleton = ({ h = 72 }) => (
      <div style={{ height: h, borderRadius: 0, marginBottom: 12, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
  );

  if (!token) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
          {!isMobile && (
              <div style={s.loginLeft}>
                <div style={s.loginLeftContent}>
                  <span style={{ ...s.loginWordmark, color: '#FFF8EA', display: 'block', marginBottom: '24px' }} onClick={() => navigate('/business-overview')}>VENIAR</span>
                  <div style={s.loginGoldLine} />
                  <h1 style={s.loginHeadline}>Run your business.<br />Reward your customers.</h1>
                  <p style={s.loginDesc}>Manage employees, services, and analytics from your business portal.</p>
                </div>
              </div>
          )}
          <div style={{ ...s.loginRight, width: isMobile ? '100%' : '480px', flex: isMobile ? 1 : 'none', padding: isMobile ? '48px 24px' : '80px 64px', boxSizing: 'border-box' }}>
            {isMobile && <span style={{ ...s.loginWordmark, display: 'block', marginBottom: '28px' }} onClick={() => navigate('/business-overview')}>VENIAR</span>}
            <span style={s.loginPortalTag}>BUSINESS PORTAL</span>
            <h2 style={s.loginTitle}>Owner Dashboard</h2>
            <p style={s.loginSub}>Sign in with your business account</p>
            <label style={s.loginLabel}>Email</label>
            <input style={s.loginInput} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <label style={s.loginLabel}>Password</label>
            <input style={s.loginInput} type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            {error && <p style={s.loginError}>{error}</p>}
            <button style={s.loginBtn} onClick={handleLogin}>Sign In</button>
            <div style={s.loginDivider} />
            <p style={s.loginEmpNote}>Are you an employee?</p>
            <button style={s.loginEmpLink} onClick={() => navigate('/employee')}>
              Go to Employee Portal →
            </button>
          </div>
        </div>
    );
  }

  const isApproved = account?.hasBusiness && account?.businessId;
  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'stats', label: 'Analytics' },
    { key: 'offers', label: 'Offers' },
    { key: 'settlement', label: 'Settlement' },
    { key: 'employees', label: 'Employees' },
    { key: 'services', label: 'Services' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
      <div style={s.container}>
        <div style={s.topBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button style={s.logo} onClick={() => navigate('/')}>
              <span style={{ fontFamily: "'Archivo', 'Inter', sans-serif", fontStretch: 'expanded', fontWeight: 800, fontSize: '1rem', color: 'var(--vn-text)', letterSpacing: '0.08em' }}>VENIAR</span>
            </button>
            {!isMobile && <span style={s.portalBadge}>BUSINESS</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!isMobile && (
              <button style={s.empPortalBtn} onClick={() => navigate('/employee')}>
                Employee Portal
              </button>
            )}
            {!isMobile && <span style={s.userName}>{account?.username}</span>}
            <button style={s.logoutBtn} onClick={() => { setToken(null); setAccount(null); }}>Sign Out</button>
          </div>
        </div>

        {isMobile && (
            <div style={s.mobileTabs}>
              {TABS.map(({ key, label }) => (
                  <button key={key} style={{ ...s.mobileTab, borderBottom: tab === key ? `2px solid ${ROYAL}` : '2px solid transparent', color: tab === key ? ROYAL : 'var(--vn-text-sub, #5F6B73)', fontWeight: tab === key ? '700' : '400' }}
                          onClick={() => setTab(key)}>
                    {label}
                  </button>
              ))}
            </div>
        )}

        <div style={{ ...s.body, flexDirection: isMobile ? 'column' : 'row' }}>
          {!isMobile && (
              <div style={s.sidebar}>
                {TABS.map(({ key, label }) => (
                    <button key={key}
                            style={{ ...s.navBtn, background: tab === key ? 'rgba(14,150,205,0.08)' : 'transparent', color: tab === key ? ROYAL : 'var(--vn-text-sub, #5F6B73)', fontWeight: tab === key ? '700' : '400' }}
                            onClick={() => setTab(key)}>
                      {label}
                    </button>
                ))}
              </div>
          )}

          <div style={{ ...s.content, padding: isMobile ? '16px' : '28px 32px' }}>
            {msg && (
                <div style={{ ...s.banner, background: msgType === 'error' ? '#fdeaea' : '#e8f4ed', color: msgType === 'error' ? '#c0392b' : '#2e7d52' }}>
                  {msg}
                </div>
            )}

            {tab === 'overview' && (
                <>
                  <h2 style={s.pageTitle}>Overview</h2>
                  <div style={{ ...s.statusCard, flexDirection: isMobile ? 'column' : 'row' }}>
                    <div style={s.statusLeft}>
                      <div style={s.bizInitial}>{account?.username?.charAt(0).toUpperCase()}</div>
                      <div>
                        <p style={s.statusName}>{account?.username}</p>
                        <p style={s.statusEmail}>{account?.email}</p>
                      </div>
                    </div>
                    <div style={{ padding: '7px 14px', borderRadius: 0, fontSize: '12px', fontWeight: '700', background: isApproved ? '#e8f4ed' : '#fff8e1', color: isApproved ? '#2e7d52' : '#e0a020', alignSelf: isMobile ? 'flex-start' : 'center' }}>
                      {isApproved ? 'Active' : 'Pending Approval'}
                    </div>
                  </div>
                  {!isApproved ? (
                      <div style={s.pendingNote}>
                        <p style={s.pendingTitle}>Your application is under review</p>
                        <p style={s.pendingSub}>Our team typically responds within 24-48 hours.</p>
                      </div>
                  ) : (
                      <div style={{ ...s.quickGrid, gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                        {[
                          { label: 'Analytics', sub: 'View points activity', key: 'stats' },
                          { label: 'Employees', sub: 'Manage staff', key: 'employees' },
                          { label: 'Services', sub: 'Manage menu', key: 'services' },
                        ].map(item => (
                            <div key={item.key} style={s.quickCard} onClick={() => setTab(item.key)}>
                              <p style={s.quickLabel}>{item.label}</p>
                              <p style={s.quickSub}>{item.sub}</p>
                            </div>
                        ))}
                      </div>
                  )}
                </>
            )}

            {tab === 'stats' && (
                <>
                  <div style={s.tabHeader}>
                    <h2 style={s.pageTitle}>Analytics</h2>
                  </div>
                  {loading ? (
                      <div style={{ ...s.statsGrid, gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} h={110} />)}
                      </div>
                  ) : !stats ? (
                      <div style={s.empty}><p>No data yet.</p></div>
                  ) : (
                      <>
                        <div style={s.statsTableWrap}>
                          {[
                            { label: 'Points Issued Today', value: stats.pointsIssuedToday ?? 0, color: '#2e7d52', bg: '#e8f4ed' },
                            { label: 'Points Redeemed Today', value: stats.pointsRedeemedToday ?? 0, color: '#c0392b', bg: '#fdeaea' },
                            { label: 'Points This Month', value: stats.pointsIssuedThisMonth ?? 0, color: ROYAL, bg: '#eff6ff' },
                            { label: 'Total Customers', value: stats.totalCustomers ?? 0, color: '#7a5500', bg: '#fff8e1' },
                          ].map((stat, i) => (
                              <div key={stat.label} style={{
                                ...s.statGridCell,
                                background: stat.bg,
                                borderRight: i % 2 === 0 ? '1.5px solid var(--vn-card-border, rgba(16,24,32,0.14))' : 'none',
                                borderBottom: i < 2 ? '1.5px solid var(--vn-card-border, rgba(16,24,32,0.14))' : 'none',
                              }}>
                                <p style={{ ...s.statValue, color: stat.color, fontSize: isMobile ? '1.6rem' : '2.2rem' }}>{stat.value.toLocaleString()}</p>
                                <p style={s.statLabel}>{stat.label}</p>
                              </div>
                          ))}
                        </div>

                        <p style={s.sectionSubHead}>Customer Insights</p>
                        <div style={{ ...s.statsGrid, gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
                          {[
                            { label: 'Repeat Visits (Month)', value: stats.repeatVisitsThisMonth ?? stats.repeatCustomers ?? '—', color: ROYAL },
                            { label: 'First-Time from Network', value: stats.newFromNetwork ?? stats.newCustomersFromNetwork ?? '—', color: '#7c3aed' },
                            { label: 'Est. Revenue Attributed', value: stats.estimatedRevenue != null ? `$${Number(stats.estimatedRevenue).toLocaleString()}` : stats.pointsIssuedThisMonth ? `~$${Math.round(stats.pointsIssuedThisMonth * 0.05).toLocaleString()}` : '—', color: '#2e7d52' },
                          ].map(stat => (
                              <div key={stat.label} style={{ ...s.statCard, background: 'var(--vn-surface, #F5F5F4)', border: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))' }}>
                                <p style={{ ...s.statValue, color: stat.color, fontSize: isMobile ? '1.3rem' : '1.7rem' }}>{stat.value}</p>
                                <p style={s.statLabel}>{stat.label}</p>
                              </div>
                          ))}
                        </div>
                        <p style={{ color: 'var(--vn-text-sub)', fontSize: '11px', margin: '6px 0 0', lineHeight: 1.5 }}>
                          Estimated Revenue uses 5¢ per point issued as a baseline — your actual figure may differ.
                        </p>
                      </>
                  )}
                </>
            )}

            {tab === 'offers' && (
                <>
                  <div style={s.tabHeader}>
                    <h2 style={s.pageTitle}>Offer Engine</h2>
                    {isApproved && (
                        <button style={s.addBtn} onClick={() => {
                          setEditingOffer(null);
                          setOfferForm({ type: 'bonus_multiplier', name: '', multiplier: '2', bonusPoints: '50', daysToReturn: '14', dayOfWeek: '', startTime: '', endTime: '', isActive: true });
                          setShowOfferForm(f => !f);
                        }}>
                          {showOfferForm ? 'Cancel' : '+ New Offer'}
                        </button>
                    )}
                  </div>

                  <div style={s.offerTypePills}>
                    {[
                      { icon: '2×', label: 'Bonus Multiplier', desc: 'Double (or more) points on a specific day or time window' },
                      { icon: '★', label: 'First Visit', desc: 'Welcome bonus for customers visiting for the first time' },
                      { icon: '↩', label: 'Return Incentive', desc: 'Reward customers who come back within N days' },
                    ].map(p => (
                        <div key={p.label} style={s.offerTypePill}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <span style={s.offerTypeIcon}>{p.icon}</span>
                            <p style={s.offerTypePillLabel}>{p.label}</p>
                          </div>
                          <p style={s.offerTypePillDesc}>{p.desc}</p>
                        </div>
                    ))}
                  </div>

                  {showOfferForm && (
                      <div style={s.formCard}>
                        <h3 style={s.formTitle}>{editingOffer ? 'Edit Offer' : 'New Offer'}</h3>
                        <label style={s.label}>Offer Name</label>
                        <input style={s.input} placeholder="e.g. Double Points Tuesday" value={offerForm.name} onChange={e => setOfferForm({ ...offerForm, name: e.target.value })} />
                        <label style={s.label}>Offer Type</label>
                        <select style={s.input} value={offerForm.type} onChange={e => setOfferForm({ ...offerForm, type: e.target.value })}>
                          <option value="bonus_multiplier">Bonus Multiplier (e.g. 2× points on a day/time)</option>
                          <option value="first_visit">First Visit Bonus</option>
                          <option value="return_incentive">Return Incentive (come back within N days)</option>
                        </select>

                        {offerForm.type === 'bonus_multiplier' && (
                            <>
                              <label style={s.label}>Points Multiplier</label>
                              <input style={s.input} type="number" min="1.5" max="10" step="0.5" placeholder="2" value={offerForm.multiplier} onChange={e => setOfferForm({ ...offerForm, multiplier: e.target.value })} />
                              <div style={{ ...s.formRow, flexDirection: isMobile ? 'column' : 'row' }}>
                                <div style={s.formHalf}>
                                  <label style={s.label}>Day of Week (optional)</label>
                                  <select style={s.input} value={offerForm.dayOfWeek} onChange={e => setOfferForm({ ...offerForm, dayOfWeek: e.target.value })}>
                                    <option value="">Every day</option>
                                    {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
                                        <option key={d} value={d.toUpperCase().slice(0,3)}>{d}</option>
                                    ))}
                                  </select>
                                </div>
                                <div style={s.formHalf}>
                                  <label style={s.label}>Time Window (optional)</label>
                                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <input style={{ ...s.input, flex: 1, marginBottom: 0 }} type="time" value={offerForm.startTime} onChange={e => setOfferForm({ ...offerForm, startTime: e.target.value })} />
                                    <span style={{ color: 'var(--vn-text-sub)', fontSize: '12px' }}>–</span>
                                    <input style={{ ...s.input, flex: 1, marginBottom: 0 }} type="time" value={offerForm.endTime} onChange={e => setOfferForm({ ...offerForm, endTime: e.target.value })} />
                                  </div>
                                </div>
                              </div>
                            </>
                        )}

                        {offerForm.type === 'first_visit' && (
                            <>
                              <label style={s.label}>Bonus Points on First Visit</label>
                              <input style={s.input} type="number" min="1" placeholder="100" value={offerForm.bonusPoints} onChange={e => setOfferForm({ ...offerForm, bonusPoints: e.target.value })} />
                            </>
                        )}

                        {offerForm.type === 'return_incentive' && (
                            <div style={{ ...s.formRow, flexDirection: isMobile ? 'column' : 'row' }}>
                              <div style={s.formHalf}>
                                <label style={s.label}>Return Within (days)</label>
                                <input style={s.input} type="number" min="1" max="365" placeholder="14" value={offerForm.daysToReturn} onChange={e => setOfferForm({ ...offerForm, daysToReturn: e.target.value })} />
                              </div>
                              <div style={s.formHalf}>
                                <label style={s.label}>Bonus Points on Return</label>
                                <input style={s.input} type="number" min="1" placeholder="50" value={offerForm.bonusPoints} onChange={e => setOfferForm({ ...offerForm, bonusPoints: e.target.value })} />
                              </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <input type="checkbox" id="offerActive" checked={offerForm.isActive} onChange={e => setOfferForm({ ...offerForm, isActive: e.target.checked })} />
                          <label htmlFor="offerActive" style={{ ...s.label, margin: 0 }}>Activate immediately</label>
                        </div>
                        <button style={{ ...s.btn, opacity: saving ? 0.7 : 1 }} onClick={handleSaveOffer} disabled={saving}>
                          {saving ? 'Saving...' : editingOffer ? 'Save Changes' : 'Create Offer'}
                        </button>
                      </div>
                  )}

                  {!isApproved && <div style={s.pendingNote}><p style={s.pendingTitle}>Business approval required before creating offers.</p></div>}

                  {loading ? [1, 2].map(i => <Skeleton key={i} h={100} />) : offers.length === 0 ? (
                      <div style={s.empty}>
                        <p style={{ fontWeight: '700', margin: '0 0 6px', color: 'var(--vn-text)', fontSize: '14px' }}>No offers yet</p>
                        <p style={{ fontSize: '13px', margin: 0 }}>Create offers to drive repeat visits and reward loyal customers.</p>
                      </div>
                  ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {offers.map(offer => (
                            <div key={offer.id} style={s.offerCard}>
                              <div style={s.offerCardLeft}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                  <span style={{ ...s.offerTypeBadge, background: offer.type === 'first_visit' ? '#f0e8ff' : offer.type === 'return_incentive' ? '#e8f4ed' : '#eff6ff', color: offer.type === 'first_visit' ? '#7c3aed' : offer.type === 'return_incentive' ? '#2e7d52' : ROYAL }}>
                                    {offer.type === 'first_visit' ? 'First Visit' : offer.type === 'return_incentive' ? 'Return' : 'Multiplier'}
                                  </span>
                                  <span style={{ ...s.offerTypeBadge, background: offer.isActive ? '#e8f4ed' : 'var(--vn-card-border, rgba(16,24,32,0.10))', color: offer.isActive ? '#2e7d52' : 'var(--vn-text-sub)' }}>
                                    {offer.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <p style={s.offerName}>{offer.name}</p>
                                <p style={s.offerMeta}>
                                  {offer.type === 'bonus_multiplier' && `${offer.multiplier}× points${offer.dayOfWeek ? ` · ${offer.dayOfWeek}` : ''}${offer.startTime ? ` · ${offer.startTime}–${offer.endTime}` : ''}`}
                                  {offer.type === 'first_visit' && `${offer.bonusPoints} bonus pts on first visit`}
                                  {offer.type === 'return_incentive' && `${offer.bonusPoints} bonus pts if back within ${offer.daysToReturn} days`}
                                </p>
                              </div>
                              <div style={s.offerCardActions}>
                                <button style={s.editBtn} onClick={() => { setEditingOffer(offer.id); setOfferForm({ ...offer }); setShowOfferForm(true); }}>Edit</button>
                                <button style={s.offerToggleBtn} onClick={() => handleToggleOffer(offer)}>{offer.isActive ? 'Pause' : 'Activate'}</button>
                                <button style={s.deleteBtn} onClick={() => handleDeleteOffer(offer.id)}>Delete</button>
                              </div>
                            </div>
                        ))}
                      </div>
                  )}
                </>
            )}

            {tab === 'settlement' && (
                <>
                  <h2 style={s.pageTitle}>Settlement Ledger</h2>
                  <p style={{ color: 'var(--vn-text-sub)', fontSize: '13px', margin: '6px 0 20px', lineHeight: 1.6 }}>
                    Track points your business has issued versus redeemed across the network. Monthly net settlements are calculated automatically.
                  </p>

                  {loading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[1, 2].map(i => <Skeleton key={i} h={110} />)}
                      </div>
                  ) : (
                      <>
                        <div style={{ ...s.settlementSummary, flexDirection: isMobile ? 'column' : 'row' }}>
                          <div style={s.settlementItem}>
                            <p style={s.settlementItemLabel}>Points Issued (Month)</p>
                            <p style={{ ...s.settlementItemValue, color: '#2e7d52' }}>
                              {(settlement?.issuedThisMonth ?? stats?.pointsIssuedThisMonth)?.toLocaleString() ?? '—'}
                            </p>
                          </div>
                          <div style={s.settlementDivider} />
                          <div style={s.settlementItem}>
                            <p style={s.settlementItemLabel}>Points Redeemed Here (Month)</p>
                            <p style={{ ...s.settlementItemValue, color: '#c0392b' }}>
                              {settlement?.redeemedThisMonth?.toLocaleString() ?? '—'}
                            </p>
                          </div>
                          <div style={s.settlementDivider} />
                          <div style={s.settlementItem}>
                            <p style={s.settlementItemLabel}>Net Position</p>
                            <p style={{ ...s.settlementItemValue, color: settlement?.netPosition >= 0 ? '#2e7d52' : '#c0392b', fontSize: isMobile ? '1.4rem' : '1.9rem' }}>
                              {settlement?.netPosition != null ? (settlement.netPosition >= 0 ? `+${settlement.netPosition.toLocaleString()}` : settlement.netPosition.toLocaleString()) : '—'}
                            </p>
                            <p style={{ color: 'var(--vn-text-sub)', fontSize: '11px', margin: '4px 0 0', lineHeight: 1.4 }}>
                              {settlement?.netPosition > 0 ? 'Network owes your business' : settlement?.netPosition < 0 ? 'Your business owes the network' : 'Settled monthly at period end'}
                            </p>
                          </div>
                        </div>

                        {settlement?.history?.length > 0 ? (
                            <>
                              <p style={{ ...s.sectionSubHead, marginTop: '24px' }}>Monthly History</p>
                              <div style={s.settlementTable}>
                                <div style={s.settlementTableHeader}>
                                  <span>Period</span>
                                  <span>Issued</span>
                                  <span>Redeemed</span>
                                  <span>Net</span>
                                  <span>Status</span>
                                </div>
                                {settlement.history.map((row, i) => (
                                    <div key={i} style={s.settlementTableRow}>
                                      <span style={{ color: 'var(--vn-text)', fontWeight: '600' }}>{row.period}</span>
                                      <span style={{ color: '#2e7d52', fontWeight: '600' }}>{row.issued?.toLocaleString()}</span>
                                      <span style={{ color: '#c0392b', fontWeight: '600' }}>{row.redeemed?.toLocaleString()}</span>
                                      <span style={{ color: row.net >= 0 ? '#2e7d52' : '#c0392b', fontWeight: '700' }}>{row.net >= 0 ? `+${row.net?.toLocaleString()}` : row.net?.toLocaleString()}</span>
                                      <span style={{ padding: '2px 8px', borderRadius: 0, fontSize: '11px', fontWeight: '700', background: row.status === 'settled' ? '#e8f4ed' : '#fff8e1', color: row.status === 'settled' ? '#2e7d52' : '#7a5500' }}>
                                        {row.status ?? 'Pending'}
                                      </span>
                                    </div>
                                ))}
                              </div>
                            </>
                        ) : (
                            <div style={{ ...s.empty, marginTop: '16px' }}>
                              <p style={{ fontWeight: '700', margin: '0 0 6px', color: 'var(--vn-text)', fontSize: '14px' }}>Settlement history will appear here</p>
                              <p style={{ fontSize: '13px', margin: 0 }}>Monthly reports are generated at the end of each billing period.</p>
                            </div>
                        )}
                      </>
                  )}
                </>
            )}

            {tab === 'employees' && (
                <>
                  <div style={s.tabHeader}>
                    <h2 style={s.pageTitle}>Employees</h2>
                    {isApproved && (
                        <button style={s.addBtn} onClick={() => setShowEmpForm(!showEmpForm)}>
                          {showEmpForm ? 'Cancel' : '+ Add'}
                        </button>
                    )}
                  </div>
                  <div style={s.empPortalCard}>
                    <div>
                      <p style={s.empPortalCardTitle}>Send employees here to sign in</p>
                      <p style={s.empPortalCardSub}>Your staff uses the employee portal to help customers earn and redeem points.</p>
                    </div>
                    <button style={s.empPortalCardBtn} onClick={() => navigate('/employee')}>
                      Open Employee Portal
                    </button>
                  </div>
                  {showEmpForm && (
                      <div style={s.formCard}>
                        <h3 style={s.formTitle}>New Employee</h3>
                        <div style={s.formRow}>
                          <div style={s.formHalf}>
                            <label style={s.label}>First name</label>
                            <input style={s.input} autoComplete="given-name" value={empForm.firstName} onChange={e => setEmpForm({ ...empForm, firstName: e.target.value })} />
                          </div>
                          <div style={s.formHalf}>
                            <label style={s.label}>Last name</label>
                            <input style={s.input} autoComplete="family-name" value={empForm.lastName} onChange={e => setEmpForm({ ...empForm, lastName: e.target.value })} />
                          </div>
                        </div>
                        <label style={s.label}>Email</label>
                        <input style={s.input} type="email" autoComplete="off" value={empForm.email} onChange={e => setEmpForm({ ...empForm, email: e.target.value })} />
                        <label style={s.label}>Temporary password</label>
                        <input style={s.input} type="password" autoComplete="new-password" value={empForm.password} onChange={e => setEmpForm({ ...empForm, password: e.target.value })} />
                        <label style={s.label}>Role</label>
                        <select style={s.input} value={empForm.role} onChange={e => setEmpForm({ ...empForm, role: e.target.value })}>
                          <option value="STAFF">Staff</option>
                          <option value="MANAGER">Manager</option>
                        </select>
                        <button style={{ ...s.btn, opacity: saving ? 0.7 : 1 }} onClick={handleAddEmployee} disabled={saving}>
                          {saving ? 'Adding...' : 'Add Employee'}
                        </button>
                      </div>
                  )}
                  {loading ? [1, 2, 3].map(i => <Skeleton key={i} h={80} />) : employees.length === 0 ? (
                      <div style={s.empty}><p>No employees yet.</p></div>
                  ) : (
                      <div style={s.empList}>
                        {employees.map(emp => (
                            <div key={emp.id} style={s.empCard}>
                              <div style={s.empAvatar}>{emp.firstName?.charAt(0)?.toUpperCase()}</div>
                              <div style={s.empInfo}>
                                <p style={s.empName}>{emp.firstName} {emp.lastName}</p>
                                <p style={s.empEmail}>{emp.email}</p>
                                <span style={{ ...s.roleBadge, background: emp.role === 'MANAGER' ? '#dbeafe' : '#eff6ff', color: emp.role === 'MANAGER' ? '#6b21a8' : ROYAL }}>
                                  {emp.role}
                                </span>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                                <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: 0, background: emp.active ? '#e8f4ed' : '#fdeaea', color: emp.active ? '#2e7d52' : '#c0392b' }}>
                                  {emp.active ? 'Active' : 'Inactive'}
                                </span>
                                {emp.active && (
                                    <button style={s.deactivateBtn} onClick={() => handleDeactivate(emp.id)}>Deactivate</button>
                                )}
                              </div>
                            </div>
                        ))}
                      </div>
                  )}
                </>
            )}

            {tab === 'services' && (
                <>
                  <div style={s.tabHeader}>
                    <h2 style={s.pageTitle}>Services</h2>
                    {isApproved && (
                        <button style={s.addBtn} onClick={() => { setEditingSvc(null); setSvcForm({ name: '', description: '', rewardsCost: '', rewardsGrant: '' }); setShowSvcForm(!showSvcForm); }}>
                          {showSvcForm ? 'Cancel' : '+ Add'}
                        </button>
                    )}
                  </div>
                  {showSvcForm && (
                      <div style={s.formCard}>
                        <h3 style={s.formTitle}>{editingSvc ? 'Edit Service' : 'New Service'}</h3>
                        <label style={s.label}>Service name</label>
                        <input style={s.input} placeholder="Large Latte" value={svcForm.name} onChange={e => setSvcForm({ ...svcForm, name: e.target.value })} />
                        <label style={s.label}>Description</label>
                        <input style={s.input} placeholder="16oz latte any flavor" value={svcForm.description} onChange={e => setSvcForm({ ...svcForm, description: e.target.value })} />
                        <div style={s.formRow}>
                          <div style={s.formHalf}>
                            <label style={s.label}>Points earned</label>
                            <input style={s.input} type="number" min="0" value={svcForm.rewardsGrant} onChange={e => setSvcForm({ ...svcForm, rewardsGrant: e.target.value })} />
                          </div>
                          <div style={s.formHalf}>
                            <label style={s.label}>Points to redeem</label>
                            <input style={s.input} type="number" min="0" value={svcForm.rewardsCost} onChange={e => setSvcForm({ ...svcForm, rewardsCost: e.target.value })} />
                          </div>
                        </div>
                        <button style={{ ...s.btn, opacity: saving ? 0.7 : 1 }} onClick={handleSaveService} disabled={saving}>
                          {saving ? 'Saving...' : editingSvc ? 'Save Changes' : 'Add Service'}
                        </button>
                      </div>
                  )}
                  {!isApproved && <div style={s.pendingNote}><p style={s.pendingTitle}>Business approval required before adding services.</p></div>}
                  {loading ? (
                      <div style={{ ...s.svcGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                        {[1, 2, 3].map(i => <Skeleton key={i} h={140} />)}
                      </div>
                  ) : services.length === 0 ? (
                      <div style={s.empty}><p>No services yet. Add your first menu item above.</p></div>
                  ) : (
                      <div style={{ ...s.svcGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                        {services.map(svc => (
                            <div key={svc.id} style={s.svcCard}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                                <h3 style={s.svcName}>{svc.name}</h3>
                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                  <button style={s.editBtn} onClick={() => handleEditService(svc)}>Edit</button>
                                  <button style={s.deleteBtn} onClick={() => handleDeleteService(svc.id)}>Delete</button>
                                </div>
                              </div>
                              <p style={s.svcDesc}>{svc.description}</p>
                              <div style={s.svcFooter}>
                                <span style={s.earnPill}>+{svc.rewardsGrant} pts earned</span>
                                <span style={s.redeemPill}>{svc.rewardsCost} pts to redeem</span>
                              </div>
                            </div>
                        ))}
                      </div>
                  )}
                </>
            )}
            {tab === 'settings' && (
                <>
                  <h2 style={s.pageTitle}>Settings</h2>

                  <div style={{ ...s.settingsCard, marginTop: '16px' }}>
                    <p style={s.settingsCardTitle}>Account Info</p>
                    <p style={s.settingsCardSub}>Update your name and email address</p>
                    <div style={{ ...s.formRow, flexDirection: isMobile ? 'column' : 'row' }}>
                      <div style={s.formHalf}>
                        <label style={s.settingsLabel}>First Name</label>
                        <input style={s.settingsInput} value={settingsProfile.firstName}
                          onChange={e => setSettingsProfile({ ...settingsProfile, firstName: e.target.value })}
                          placeholder="First name" autoComplete="given-name" />
                      </div>
                      <div style={s.formHalf}>
                        <label style={s.settingsLabel}>Last Name</label>
                        <input style={s.settingsInput} value={settingsProfile.lastName}
                          onChange={e => setSettingsProfile({ ...settingsProfile, lastName: e.target.value })}
                          placeholder="Last name" autoComplete="family-name" />
                      </div>
                    </div>
                    <label style={s.settingsLabel}>Email</label>
                    <input style={s.settingsInput} type="email" value={settingsProfile.email}
                      onChange={e => setSettingsProfile({ ...settingsProfile, email: e.target.value })}
                      placeholder="you@email.com" autoComplete="email" />
                    {settingsProfileMsg.text && (
                      <p style={{ ...s.settingsFeedback, color: settingsProfileMsg.type === 'error' ? '#c0392b' : '#2e7d52', background: settingsProfileMsg.type === 'error' ? '#fdeaea' : '#e8f4ed', border: `1px solid ${settingsProfileMsg.type === 'error' ? '#fbc0c0' : '#a8d5b5'}` }}>
                        {settingsProfileMsg.text}
                      </p>
                    )}
                    <button style={{ ...s.addBtn, opacity: settingsProfileSaving ? 0.7 : 1 }}
                      onClick={handleSettingsProfileSave} disabled={settingsProfileSaving}>
                      {settingsProfileSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>

                  <div style={s.settingsCard}>
                    <p style={s.settingsCardTitle}>Security</p>
                    <p style={s.settingsCardSub}>Change your password</p>
                    <label style={s.settingsLabel}>Current Password</label>
                    <input style={s.settingsInput} type="password" value={settingsPw.current}
                      onChange={e => setSettingsPw({ ...settingsPw, current: e.target.value })}
                      placeholder="••••••••" autoComplete="current-password" />
                    <label style={s.settingsLabel}>New Password</label>
                    <input style={s.settingsInput} type="password" value={settingsPw.next}
                      onChange={e => setSettingsPw({ ...settingsPw, next: e.target.value })}
                      placeholder="At least 8 characters" autoComplete="new-password" />
                    <label style={s.settingsLabel}>Confirm New Password</label>
                    <input style={s.settingsInput} type="password" value={settingsPw.confirm}
                      onChange={e => setSettingsPw({ ...settingsPw, confirm: e.target.value })}
                      placeholder="••••••••" autoComplete="new-password"
                      onKeyDown={e => e.key === 'Enter' && handleSettingsPwSave()} />
                    {settingsPwMsg.text && (
                      <p style={{ ...s.settingsFeedback, color: settingsPwMsg.type === 'error' ? '#c0392b' : '#2e7d52', background: settingsPwMsg.type === 'error' ? '#fdeaea' : '#e8f4ed', border: `1px solid ${settingsPwMsg.type === 'error' ? '#fbc0c0' : '#a8d5b5'}` }}>
                        {settingsPwMsg.text}
                      </p>
                    )}
                    <button style={{ ...s.addBtn, opacity: settingsPwSaving ? 0.7 : 1 }}
                      onClick={handleSettingsPwSave} disabled={settingsPwSaving}>
                      {settingsPwSaving ? 'Updating…' : 'Update Password'}
                    </button>
                  </div>

                  <div style={{ ...s.settingsCard, border: '1.5px solid #fbc0c0', background: '#fffafa' }}>
                    <p style={{ ...s.settingsCardTitle, color: '#c0392b' }}>Sign Out</p>
                    <p style={s.settingsCardSub}>Sign out of the business portal on this device.</p>
                    <button style={s.settingsDangerBtn}
                      onClick={() => { setToken(null); setAccount(null); }}>
                      Sign Out
                    </button>
                  </div>
                </>
            )}
          </div>
        </div>
      </div>
  );
}

const s = {
  loginLeft: { flex: 1, background: '#0E0D0C', display: 'flex', alignItems: 'center', padding: '80px', position: 'relative', overflow: 'hidden' },
  loginLeftContent: { position: 'relative', zIndex: 2 },
  loginWordmark: { fontFamily: "'Archivo', 'Inter', sans-serif", fontStretch: 'expanded', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.08em', color: 'var(--vn-text)', cursor: 'pointer' },
  loginGoldLine: { width: '56px', height: '1px', background: 'var(--vn-line, rgba(255,248,234,0.16))', marginBottom: '32px' },
  loginHeadline: { color: '#FFF8EA', fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.08, letterSpacing: '0.02em', textTransform: 'uppercase', fontFamily: "'Archivo', 'Inter', sans-serif", margin: '0 0 20px 0', maxWidth: '460px' },
  loginDesc: { color: 'rgba(255,248,234,0.65)', fontSize: '15px', lineHeight: 1.7, margin: 0, maxWidth: '360px' },
  loginRight: { display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--vn-bg, #FFFFFF)' },
  loginPortalTag: { display: 'inline-block', background: 'var(--vn-surface)', color: 'var(--rosso)', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', padding: '5px 12px', borderRadius: 0, marginBottom: '20px', border: '1px solid var(--rosso)' },
  loginTitle: { color: 'var(--vn-text)', fontSize: '2rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '0.03em', textTransform: 'uppercase', fontFamily: "'Archivo', 'Inter', sans-serif" },
  loginSub: { color: 'var(--vn-text-sub)', fontSize: '1rem', margin: '0 0 36px 0' },
  loginLabel: { color: 'var(--vn-text-sub)', fontSize: '10px', fontWeight: '700', marginBottom: '7px', display: 'block', letterSpacing: '2px', textTransform: 'uppercase' },
  loginInput: { padding: '14px 16px', borderRadius: 0, border: '1px solid var(--vn-line, var(--vn-card-border))', background: 'var(--vn-bg, #FFF8EA)', color: 'var(--vn-text)', fontSize: '15px', marginBottom: '20px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  loginBtn: { padding: '16px', borderRadius: 0, border: 'none', background: 'var(--rosso)', color: '#FFF8EA', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', width: '100%' },
  loginError: { color: '#dc2626', fontSize: '13px', background: '#fef2f2', padding: '10px 14px', borderRadius: 0, border: '1px solid #fecaca', margin: '0 0 14px 0' },
  label: { color: 'var(--vn-text-sub)', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' },
  input: { padding: '10px 14px', borderRadius: 0, border: '1.5px solid var(--vn-card-border, rgba(16,24,32,0.14))', background: 'var(--vn-bg, #FFF8EA)', color: 'var(--vn-text)', fontSize: '14px', marginBottom: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  btn: { padding: '12px', borderRadius: 0, border: 'none', background: ROYAL, color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', width: '100%' },
  error: { color: '#dc2626', fontSize: '13px', background: '#fef2f2', padding: '10px 14px', borderRadius: 0, border: '1px solid #fecaca', margin: '0 0 14px 0' },
  container: { minHeight: '100vh', background: 'var(--vn-bg, #FFF8EA)', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", display: 'flex', flexDirection: 'column' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--vn-card, #FFFFFF)', borderBottom: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', boxShadow: 'none', position: 'sticky', top: 0, zIndex: 100 },
  logo: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', lineHeight: 0 },
  portalBadge: { background: ROYAL, color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', padding: '3px 10px', borderRadius: 0 },
  logoutBtn: { padding: '7px 14px', borderRadius: 0, border: '1.5px solid var(--vn-card-border, rgba(16,24,32,0.10))', background: 'transparent', color: 'var(--vn-text-sub)', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  empPortalBtn: { padding: '7px 14px', borderRadius: 0, border: `1.5px solid ${ROYAL}`, background: 'transparent', color: ROYAL, fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' },
  loginDivider: { height: '1px', background: 'var(--vn-card-border, rgba(16,24,32,0.12))', margin: '20px 0' },
  loginEmpNote: { color: 'var(--vn-text-sub)', fontSize: '13px', margin: '0 0 6px 0' },
  loginEmpLink: { display: 'block', width: '100%', boxSizing: 'border-box', color: 'var(--rosso)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '12px 16px', borderRadius: 0, border: '1px solid var(--rosso)', textAlign: 'center', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' },
  empPortalCard: { background: 'var(--vn-surface, #F5F5F4)', borderRadius: 0, padding: '16px 18px', border: '1.5px solid var(--vn-card-border, rgba(16,24,32,0.12))', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  empPortalCardTitle: { color: 'var(--vn-text)', fontSize: '13px', fontWeight: '700', margin: '0 0 4px 0' },
  empPortalCardSub: { color: 'var(--vn-text-sub)', fontSize: '12px', margin: 0, lineHeight: 1.5 },
  empPortalCardBtn: { padding: '10px 18px', borderRadius: 0, border: 'none', background: ROYAL, color: '#fff', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit' },
  userName: { color: 'var(--vn-text-sub)', fontSize: '13px', fontWeight: '600' },
  mobileTabs: { display: 'flex', background: 'var(--vn-card, #FFFFFF)', borderBottom: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', overflowX: 'auto', flexShrink: 0 },
  mobileTab: { flexShrink: 0, padding: '12px 16px', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' },
  body: { display: 'flex', flex: 1 },
  sidebar: { width: '190px', background: 'var(--vn-card, #FFFFFF)', borderRight: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 },
  navBtn: { padding: '10px 14px', borderRadius: 0, border: 'none', fontSize: '13px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s' },
  content: { flex: 1, overflowY: 'auto', minWidth: 0 },
  banner: { padding: '12px 16px', borderRadius: 0, fontSize: '13px', fontWeight: '600', marginBottom: '20px' },
  pageTitle: { color: 'var(--vn-text)', fontSize: '1.2rem', fontWeight: '700', margin: 0 },
  tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  addBtn: { padding: '9px 16px', borderRadius: 0, border: 'none', background: ROYAL, color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', flexShrink: 0 },
  empty: { background: 'var(--vn-surface, #F5F5F4)', borderRadius: 0, padding: '40px 24px', textAlign: 'center', border: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', color: 'var(--vn-text-sub)' },
  statusCard: { background: 'var(--vn-surface, #F5F5F4)', borderRadius: 0, padding: '18px', border: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px' },
  statusLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  bizInitial: { width: '42px', height: '42px', borderRadius: 0, background: 'var(--rosso)', color: '#FFF8EA', fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statusName: { color: 'var(--vn-text)', fontSize: '14px', fontWeight: '700', margin: '0 0 2px 0' },
  statusEmail: { color: 'var(--vn-text-sub)', fontSize: '12px', margin: 0 },
  pendingNote: { background: '#fff8e1', borderRadius: 0, padding: '16px 18px', border: '1px solid #ffe082', marginBottom: '16px' },
  pendingTitle: { color: '#7a5500', fontSize: '13px', fontWeight: '700', margin: '0 0 4px 0' },
  pendingSub: { color: '#7a5500', fontSize: '12px', margin: 0, lineHeight: 1.6 },
  quickGrid: { display: 'grid', gap: '12px' },
  quickCard: { background: 'var(--vn-surface, #F5F5F4)', borderRadius: 0, padding: '18px', border: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', cursor: 'pointer' },
  quickLabel: { color: ROYAL, fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0' },
  quickSub: { color: 'var(--vn-text-sub)', fontSize: '12px', margin: 0 },
  statsGrid: { display: 'grid', gap: '12px' },
  statsTableWrap: { display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 0, overflow: 'hidden', border: '1.5px solid var(--vn-card-border, rgba(16,24,32,0.14))' },
  statGridCell: { padding: '20px 18px' },
  statCard: { borderRadius: 0, padding: '18px', border: '1px solid #eee' },
  statValue: { fontWeight: '800', margin: '0 0 6px 0', lineHeight: 1 },
  statLabel: { color: '#555', fontSize: '12px', fontWeight: '600', margin: 0 },
  formCard: { background: 'var(--vn-surface, #F5F5F4)', borderRadius: 0, padding: '18px', border: '1.5px solid var(--vn-card-border, rgba(16,24,32,0.10))', marginBottom: '16px' },
  formTitle: { color: 'var(--vn-text)', fontSize: '14px', fontWeight: '700', margin: '0 0 14px 0' },
  formRow: { display: 'flex', gap: '12px' },
  formHalf: { flex: 1, display: 'flex', flexDirection: 'column' },
  empList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  empCard: { background: 'var(--vn-surface, #F5F5F4)', borderRadius: 0, padding: '14px 16px', border: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', display: 'flex', alignItems: 'center', gap: '12px' },
  empAvatar: { width: '38px', height: '38px', borderRadius: '50%', background: 'var(--rosso)', color: '#FFF8EA', fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  empInfo: { flex: 1, minWidth: '80px' },
  empName: { color: 'var(--vn-text)', fontSize: '13px', fontWeight: '700', margin: '0 0 2px 0' },
  empEmail: { color: 'var(--vn-text-sub)', fontSize: '11px', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  roleBadge: { fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: 0 },
  deactivateBtn: { padding: '5px 10px', borderRadius: 0, border: '1.5px solid #ffd0d0', background: 'transparent', color: '#c0392b', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  svcGrid: { display: 'grid', gap: '12px' },
  svcCard: { background: 'var(--vn-surface, #F5F5F4)', borderRadius: 0, padding: '16px', border: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))' },
  svcName: { color: 'var(--vn-text)', fontSize: '14px', fontWeight: '700', margin: 0, wordBreak: 'break-word' },
  svcDesc: { color: 'var(--vn-text-sub)', fontSize: '12px', margin: '0 0 12px 0', lineHeight: 1.5 },
  svcFooter: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  earnPill: { background: '#e8f4ed', color: '#2e7d52', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: 0 },
  redeemPill: { background: '#eff6ff', color: ROYAL, fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: 0 },
  editBtn: { padding: '5px 10px', borderRadius: 0, border: `1.5px solid ${ROYAL}`, background: 'transparent', color: ROYAL, fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  deleteBtn: { padding: '5px 10px', borderRadius: 0, border: '1.5px solid #ffd0d0', background: 'transparent', color: '#c0392b', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  settingsCard: { background: 'var(--vn-surface, #F5F5F4)', borderRadius: 0, padding: '22px', border: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', marginBottom: '16px' },
  settingsCardTitle: { color: 'var(--vn-text)', fontSize: '14px', fontWeight: '700', margin: '0 0 3px' },
  settingsCardSub: { color: 'var(--vn-text-sub)', fontSize: '12px', margin: '0 0 18px', lineHeight: 1.5 },
  settingsLabel: { color: 'var(--vn-text-sub)', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' },
  settingsInput: { width: '100%', padding: '11px 14px', borderRadius: 0, border: '1.5px solid var(--vn-card-border, rgba(16,24,32,0.14))', background: 'var(--vn-bg, #FFF8EA)', color: 'var(--vn-text)', fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  settingsFeedback: { fontSize: '13px', padding: '10px 14px', borderRadius: 0, margin: '0 0 14px' },
  settingsDangerBtn: { padding: '10px 20px', borderRadius: 0, border: '1.5px solid #ffd0d0', background: 'transparent', color: '#c0392b', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  sectionSubHead: { color: 'var(--vn-text)', fontSize: '11px', fontWeight: '700', margin: '20px 0 12px', letterSpacing: '1.5px', textTransform: 'uppercase' },
  offerTypePills: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' },
  offerTypePill: { background: 'var(--vn-surface, #F5F5F4)', border: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', borderRadius: 0, padding: '12px 14px', flex: 1, minWidth: '140px' },
  offerTypeIcon: { fontSize: '14px', fontWeight: '800', color: ROYAL },
  offerTypePillLabel: { color: 'var(--vn-text)', fontSize: '12px', fontWeight: '700', margin: 0 },
  offerTypePillDesc: { color: 'var(--vn-text-sub)', fontSize: '11px', margin: '4px 0 0', lineHeight: 1.4 },
  offerCard: { background: 'var(--vn-surface, #F5F5F4)', borderRadius: 0, padding: '16px', border: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' },
  offerCardLeft: { flex: 1, minWidth: '180px' },
  offerCardActions: { display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap', alignItems: 'flex-start' },
  offerTypeBadge: { fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: 0 },
  offerName: { color: 'var(--vn-text)', fontSize: '14px', fontWeight: '700', margin: '6px 0 4px' },
  offerMeta: { color: 'var(--vn-text-sub)', fontSize: '12px', margin: 0, lineHeight: 1.5 },
  offerToggleBtn: { padding: '5px 10px', borderRadius: 0, border: `1.5px solid ${ROYAL}`, background: 'transparent', color: ROYAL, fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  settlementSummary: { background: 'var(--vn-surface, #F5F5F4)', borderRadius: 0, border: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', display: 'flex', flexWrap: 'wrap', overflow: 'hidden' },
  settlementItem: { flex: 1, minWidth: '140px', padding: '20px 16px', textAlign: 'center' },
  settlementItemLabel: { color: 'var(--vn-text-sub)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' },
  settlementItemValue: { fontWeight: '800', fontSize: '1.6rem', margin: 0, lineHeight: 1.1 },
  settlementDivider: { width: '1px', background: 'var(--vn-card-border, rgba(16,24,32,0.10))', flexShrink: 0 },
  settlementTable: { background: 'var(--vn-surface, #F5F5F4)', borderRadius: 0, overflow: 'hidden', border: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))' },
  settlementTableHeader: { display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', padding: '10px 16px', background: 'var(--vn-card-border, rgba(16,24,32,0.10))', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--vn-text-sub)', gap: '8px' },
  settlementTableRow: { display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', padding: '12px 16px', borderTop: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', fontSize: '13px', alignItems: 'center', gap: '8px' },
};

export default BusinessOwnerDashboard;
