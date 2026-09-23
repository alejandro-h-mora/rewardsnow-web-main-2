import { useState } from 'react';
import { API } from './config';
import { useIsMobile } from './useIsMobile';

const BLUE = 'var(--rosso)';

const TIERS = [
  {
    key: 'standard',
    name: 'Standard',
    price: '$100',
    period: '/mo',
    desc: 'Join the Veniar Network. Customers earn Veniar Points that work across every partner in the city.',
    paidPartner: false,
    uniqueRewards: false,
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '$190',
    period: '/mo',
    desc: 'Priority placement in search and the map, full analytics dashboard, dedicated support, and performance guarantee.',
    paidPartner: true,
    uniqueRewards: false,
  },
  {
    key: 'custom',
    name: 'Custom Rewards',
    price: '$250',
    period: '/mo',
    desc: "Your own branded points currency. Customers earn your points — not Veniar Points. Fully private-label.",
    paidPartner: true,
    uniqueRewards: true,
    badge: 'Most popular',
  },
];

export default function BusinessRegister({ onBack, onSuccess }) {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [accountToken, setAccountToken] = useState(null);
  const [form, setForm] = useState({ email: '', phoneNumber: '', username: '', password: '' });
  const [bizForm, setBizForm] = useState({ businessName: '', streetAddress: '', city: '', state: '', zip: '', latitude: '', longitude: '' });

  const buildAddress = () => {
    const { streetAddress, city, state, zip } = bizForm;
    const parts = [streetAddress, city, state && zip ? `${state} ${zip}` : (state || zip)].filter(Boolean);
    return parts.join(', ');
  };
  const [tier, setTier] = useState('standard');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const set = (setter, field) => e => setter(prev => ({ ...prev, [field]: e.target.value }));

  const handleCreateAccount = async () => {
    setError('');
    const { email, phoneNumber, username, password } = form;
    if (!email || !phoneNumber || !username || !password) { setError('All fields are required'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10) { setError('Enter a valid 10-digit phone number'); return; }
    setLoading(true);
    try {
      const regRes = await fetch(`${API}/business-accounts/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phoneNumber: phoneDigits }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) {
        setError(regData.error || regData.message || JSON.stringify(regData));
        return;
      }

      const loginRes = await fetch(`${API}/business-accounts/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setError(loginData.error || loginData.message || 'Login failed after registration');
        return;
      }

      setAccountToken(loginData.token);
      setStep(2);
    } catch {
      setError('Could not connect. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const geocodeAddress = async () => {
    const addr = buildAddress();
    if (!addr.trim()) { setError('Enter a street address first'); return; }
    setGeocoding(true);
    setError('');
    try {
      const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr)}&format=json&limit=1`,
          { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data.length > 0) {
        setBizForm(prev => ({
          ...prev,
          latitude: parseFloat(data[0].lat).toFixed(6),
          longitude: parseFloat(data[0].lon).toFixed(6),
        }));
      } else {
        setError('Address not found — try being more specific');
      }
    } catch {
      setError('Could not look up coordinates');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmitRequest = async () => {
    setError('');
    const address = buildAddress();
    if (!bizForm.businessName || !address) { setError('Business name and full address are required'); return; }
    if (!bizForm.streetAddress) { setError('Street address is required'); return; }
    if (!bizForm.city) { setError('City is required'); return; }
    setLoading(true);
    const selectedTier = TIERS.find(t => t.key === tier);
    try {
      const res = await fetch(`${API}/business-accounts/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accountToken}` },
        body: JSON.stringify({
          businessName: bizForm.businessName,
          contactEmail: form.email,
          contactPhone: form.phoneNumber.replace(/\D/g, ''),
          requestingPaidPartner: selectedTier.paidPartner,
          requestingUniqueRewardsPoint: selectedTier.uniqueRewards,
          latitude: bizForm.latitude ? parseFloat(bizForm.latitude) : null,
          longitude: bizForm.longitude ? parseFloat(bizForm.longitude) : null,
          address,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || data.message || JSON.stringify(data)); }
      else { setStep(3); onSuccess?.(); }
    } catch {
      setError('Could not connect. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={s.root}>
        {/* Left panel — desktop only */}
        {!isMobile && (
            <div style={s.left}>
              <div style={s.leftInner}>
                <button style={s.backLink} onClick={onBack}>← Back to sign in</button>
                <div style={s.brand}>Veniar</div>
                <h1 style={s.headline}>Grow your business<br />with loyalty.</h1>
                <p style={s.tagline}>
                  Join the Veniar Network and give your customers a reason to keep coming back.
                </p>
                <div style={s.steps}>
                  {['Create account', 'Business details', 'Under review'].map((label, i) => (
                      <div key={i} style={s.stepRow}>
                        <div style={{
                          ...s.stepCircle,
                          background: step > i + 1 ? BLUE : step === i + 1 ? BLUE : 'transparent',
                          border: `2px solid ${step >= i + 1 ? BLUE : 'rgba(255,255,255,0.2)'}`,
                          color: step >= i + 1 ? '#fff' : 'rgba(255,255,255,0.3)',
                        }}>
                          {step > i + 1 ? '✓' : i + 1}
                        </div>
                        <span style={{ ...s.stepLabel, opacity: step >= i + 1 ? 1 : 0.35 }}>{label}</span>
                      </div>
                  ))}
                </div>
              </div>
            </div>
        )}

        <div style={{
          ...s.right,
          width: isMobile ? '100%' : '520px',
          padding: isMobile ? '0' : '48px',
          borderLeft: isMobile ? 'none' : '1px solid var(--vn-card-border, rgba(16,24,32,0.10))',
        }}>
          {/* Mobile top bar */}
          {isMobile && (
              <div style={s.mobileTopBar}>
                <button style={s.mobileBack} onClick={step > 1 ? () => setStep(s => s - 1) : onBack}>←</button>
                <span style={s.mobileBrand}>Veniar</span>
                <div style={s.mobileStepDots}>
                  {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        ...s.stepDot,
                        background: step >= i ? BLUE : '#e0e0e0',
                      }} />
                  ))}
                </div>
              </div>
          )}

          <div style={{ ...s.form, padding: isMobile ? '28px 24px 48px' : '0' }}>
            {step === 1 && (
                <>
                  <h2 style={s.formTitle}>Create your account</h2>
                  <p style={s.formSub}>Step 1 of 2</p>
                  <div style={s.field}>
                    <label style={s.label}>Email</label>
                    <input style={s.input} type="email" autoComplete="email"
                           placeholder="owner@business.com"
                           value={form.email} onChange={set(setForm, 'email')}
                           onKeyDown={e => e.key === 'Enter' && handleCreateAccount()} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Username</label>
                    <input style={s.input} autoComplete="username" placeholder="bizowner"
                           value={form.username} onChange={set(setForm, 'username')}
                           onKeyDown={e => e.key === 'Enter' && handleCreateAccount()} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Phone</label>
                    <input style={s.input} type="tel" autoComplete="tel-national" placeholder="5551234567"
                           value={form.phoneNumber} onChange={set(setForm, 'phoneNumber')}
                           onKeyDown={e => e.key === 'Enter' && handleCreateAccount()} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Password</label>
                    <input style={s.input} type="password" autoComplete="new-password"
                           placeholder="8+ characters"
                           value={form.password} onChange={set(setForm, 'password')}
                           onKeyDown={e => e.key === 'Enter' && handleCreateAccount()} />
                  </div>
                  {error && <p style={s.error}>{error}</p>}
                  <button style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }} onClick={handleCreateAccount} disabled={loading}>
                    {loading ? 'Creating account…' : 'Continue →'}
                  </button>
                </>
            )}

            {step === 2 && (
                <>
                  <h2 style={s.formTitle}>Business details</h2>
                  <p style={s.formSub}>Step 2 of 2</p>
                  <div style={s.field}>
                    <label style={s.label}>Business Name</label>
                    <input style={s.input} autoComplete="organization" placeholder="Joe's Coffee"
                           value={bizForm.businessName} onChange={set(setBizForm, 'businessName')} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Business Address</label>
                    <p style={s.addrHint}>Fill in each field separately so we can locate your business accurately.</p>
                    <input style={s.input}
                           autoComplete="address-line1"
                           placeholder="Street address (e.g. 123 Main Street)"
                           value={bizForm.streetAddress} onChange={set(setBizForm, 'streetAddress')} />
                    <div style={s.addrCityRow}>
                      <input style={{ ...s.input, flex: 2, marginBottom: 0 }}
                             autoComplete="address-level2"
                             placeholder="City"
                             value={bizForm.city} onChange={set(setBizForm, 'city')} />
                      <input style={{ ...s.input, flex: 1, marginBottom: 0 }}
                             autoComplete="address-level1"
                             placeholder="State (FL)"
                             maxLength={2}
                             value={bizForm.state} onChange={set(setBizForm, 'state')} />
                      <input style={{ ...s.input, flex: 1, marginBottom: 0 }}
                             autoComplete="postal-code"
                             placeholder="ZIP"
                             value={bizForm.zip} onChange={set(setBizForm, 'zip')} />
                    </div>
                    <div style={s.addrLocateRow}>
                      <span style={s.addrPreview}>
                        {buildAddress() || <span style={{ color: '#aaa' }}>Full address will appear here</span>}
                      </span>
                      <button style={{ ...s.geocodeBtn, opacity: geocoding ? 0.6 : 1 }}
                              onClick={geocodeAddress} disabled={geocoding}>
                        {geocoding ? '…' : 'Locate'}
                      </button>
                    </div>
                    {bizForm.latitude && (
                        <p style={s.geocodeConfirm}>✓ Located on map: {bizForm.latitude}, {bizForm.longitude}</p>
                    )}
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Select Your Plan</label>
                    <div style={s.tierList}>
                      {TIERS.map(t => (
                          <div key={t.key} style={{ ...s.tierCard, ...(tier === t.key ? s.tierCardSelected : {}) }}
                               onClick={() => setTier(t.key)}>
                            <div style={s.tierHeader}>
                              <div>
                                <p style={s.tierName}>{t.name}</p>
                                {t.badge && <span style={s.tierBadge}>{t.badge}</span>}
                              </div>
                              <p style={s.tierPrice}>{t.price}<span style={s.tierPeriod}>{t.period}</span></p>
                            </div>
                            <p style={s.tierDesc}>{t.desc}</p>
                            <div style={{ ...s.tierRadio, ...(tier === t.key ? s.tierRadioSelected : {}) }} />
                          </div>
                      ))}
                    </div>
                  </div>
                  {error && <p style={s.error}>{error}</p>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {!isMobile && <button style={s.backBtn} onClick={() => setStep(1)}>← Back</button>}
                    <button style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1, flex: 1 }} onClick={handleSubmitRequest} disabled={loading}>
                      {loading ? 'Submitting…' : 'Submit application'}
                    </button>
                  </div>
                </>
            )}

            {step === 3 && (
                <div style={s.successScreen}>
                  <div style={s.successIcon}>✓</div>
                  <h2 style={s.formTitle}>Application submitted</h2>
                  <p style={s.successMsg}>
                    Our team reviews every application within 24–48 hours. You'll get an email the moment your business goes live.
                  </p>
                  <p style={s.successTier}>Plan selected: <strong>{TIERS.find(t => t.key === tier)?.name}</strong></p>
                  <button style={s.submitBtn} onClick={onBack}>Back to sign in</button>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

const s = {
  root: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: 'var(--vn-bg, #FFF8EA)' },
  left: { flex: 1, background: '#0A1211', display: 'flex', alignItems: 'center', padding: '80px', position: 'relative', overflow: 'hidden' },
  leftInner: { maxWidth: '440px', width: '100%', position: 'relative', zIndex: 2 },
  backLink: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0, marginBottom: '48px', display: 'block' },
  brand: { color: '#f59e0b', fontSize: '12px', fontWeight: '700', letterSpacing: '4px', marginBottom: '48px', textTransform: 'uppercase' },
  headline: { color: '#fff', fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.06, letterSpacing: '0.02em', textTransform: 'uppercase', fontFamily: "'Archivo', 'Inter', sans-serif", margin: '0 0 20px' },
  tagline: { color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.7, margin: '0 0 48px' },
  steps: { display: 'flex', flexDirection: 'column', gap: '16px' },
  stepRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  stepCircle: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  stepLabel: { color: '#fff', fontSize: '13px', fontWeight: '500' },
  right: { display: 'flex', flexDirection: 'column', overflowY: 'auto', boxSizing: 'border-box', background: 'var(--vn-card, #FFFFFF)' },
  mobileTopBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--vn-card-border, rgba(16,24,32,0.10))', position: 'sticky', top: 0, background: 'var(--vn-bg, #FFF8EA)', zIndex: 10 },
  mobileBack: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--vn-text-sub, #5F6B73)', padding: '4px 8px' },
  mobileBrand: { color: 'var(--vn-text)', fontSize: '15px', fontWeight: '700' },
  mobileStepDots: { display: 'flex', gap: '6px' },
  stepDot: { width: '8px', height: '8px', borderRadius: '50%', transition: 'background 0.2s' },
  form: { width: '100%', maxWidth: '400px', margin: '0 auto', boxSizing: 'border-box' },
  formTitle: { color: 'var(--vn-text)', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '0.03em', textTransform: 'uppercase', fontFamily: "'Archivo', 'Inter', sans-serif" },
  formSub: { color: 'var(--rosso)', fontSize: '13px', margin: '0 0 28px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', color: 'var(--vn-text-sub)', fontSize: '10px', fontWeight: '700', marginBottom: '7px', letterSpacing: '2px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '11px 14px', border: '2px solid var(--vn-card-border, rgba(16,24,32,0.14))', borderRadius: 0, fontSize: '14px', color: 'var(--vn-text)', background: 'var(--vn-bg, #FFF8EA)', outline: 'none', boxSizing: 'border-box', marginBottom: 0 },
  addrHint: { color: '#6b7280', fontSize: '12px', margin: '0 0 10px', lineHeight: 1.5 },
  addrCityRow: { display: 'flex', gap: '8px', marginBottom: '8px' },
  addrLocateRow: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' },
  addrPreview: { flex: 1, fontSize: '12px', color: '#374151', padding: '9px 12px', background: 'var(--vn-surface, #F5F5F4)', border: '1.5px dashed var(--vn-card-border, rgba(16,24,32,0.18))', borderRadius: 0, wordBreak: 'break-word', minHeight: '20px', display: 'block' },
  geocodeBtn: { padding: '11px 14px', background: 'var(--vn-surface)', border: '1px solid var(--rosso)', borderRadius: 0, color: 'var(--rosso)', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 },
  geocodeConfirm: { color: '#16a34a', fontSize: '12px', margin: '6px 0 0' },
  tierList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  tierCard: { border: '2px solid var(--vn-card-border, rgba(16,24,32,0.14))', borderRadius: 0, padding: '14px 16px', cursor: 'pointer', position: 'relative', background: 'var(--vn-surface, #F5F5F4)' },
  tierCardSelected: { borderColor: BLUE, background: 'rgba(14,150,205,0.07)' },
  tierHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' },
  tierName: { color: 'var(--vn-text)', fontSize: '14px', fontWeight: '600', margin: 0 },
  tierBadge: { background: 'var(--rosso)', color: '#FFF8EA', fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: 0, marginTop: '4px', display: 'inline-block' },
  tierPrice: { color: 'var(--vn-text)', fontSize: '16px', fontWeight: '700', margin: 0 },
  tierPeriod: { color: '#9ca3af', fontSize: '12px', fontWeight: '400' },
  tierDesc: { color: '#6b7280', fontSize: '12px', lineHeight: 1.5, margin: 0, paddingRight: '24px' },
  tierRadio: { position: 'absolute', top: '16px', right: '16px', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #d1d5db', background: '#fff' },
  tierRadioSelected: { borderColor: BLUE, background: BLUE },
  error: { color: '#dc2626', fontSize: '13px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 0, padding: '10px 14px', margin: '0 0 14px' },
  submitBtn: { width: '100%', padding: '12px', background: 'var(--rosso)', color: '#FFF8EA', border: 'none', borderRadius: 0, fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  backBtn: { padding: '12px 16px', background: 'transparent', color: 'var(--vn-text)', border: '2px solid var(--vn-card-border, rgba(16,24,32,0.18))', borderRadius: 0, fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  successScreen: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  successIcon: { width: '64px', height: '64px', borderRadius: '50%', background: 'var(--rosso)', color: '#FFF8EA', fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  successMsg: { color: 'var(--vn-text-sub, #5F6B73)', fontSize: '14px', lineHeight: 1.7, margin: 0 },
  successTier: { color: 'var(--vn-text-sub, #5F6B73)', fontSize: '13px', margin: 0 },
};
