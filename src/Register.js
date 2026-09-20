import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from './useIsMobile';
import { API } from './config';

function Register({ onRegister, onBack }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', phoneNumber: '', username: '', age: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleRegister = async () => {
    setError('');
    if (!form.firstName || !form.lastName || !form.email ||
        !form.password || !form.phoneNumber || !form.username || !form.age) {
      setError('Please fill in all fields');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/^[0-9]{10,15}$/.test(form.phoneNumber)) {
      setError('Phone number must be 10-15 digits, no spaces or dashes');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/customers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: parseInt(form.age) })
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        onRegister(data);
      }
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={s.container}>
        <div style={{ ...s.wrapper, flexDirection: isMobile ? 'column' : 'row' }}>

          {isMobile ? (
              <div style={s.mobileHeader}>
                <span style={s.wordmark} onClick={() => navigate('/')}>VENIAR</span>
                <span style={s.mobileHeaderSub}>Create your free account</span>
              </div>
          ) : (
              <div style={s.leftPanel}>
                <div style={s.leftContent}>
                  <span style={{ ...s.wordmark, color: '#FFF8EA', display: 'block', marginBottom: '24px' }} onClick={() => navigate('/')}>VENIAR</span>
                  <div style={s.goldLine} />
                  <p style={s.tagline}>Join thousands earning rewards every day.</p>
                </div>
              </div>
          )}

          <div style={{
            ...s.rightPanel,
            width: isMobile ? '100%' : '520px',
            padding: isMobile ? '28px 24px 48px' : '48px 56px',
            borderLeft: isMobile ? 'none' : '1px solid var(--vn-line, var(--vn-card-border))',
            flex: isMobile ? '1' : 'none',
          }}>
            <h1 style={{ ...s.brandName, fontSize: isMobile ? '1.6rem' : '2rem' }}>Create Account</h1>
            <p style={s.brandSub}>Join Veniar for free</p>

            <div style={s.row}>
              <div style={s.half}>
                <label style={s.inputLabel}>First Name</label>
                <input style={s.input} placeholder="First name" value={form.firstName}
                       onChange={handleChange('firstName')} autoComplete="given-name"
                       onKeyDown={e => e.key === 'Enter' && handleRegister()} />
              </div>
              <div style={s.half}>
                <label style={s.inputLabel}>Last Name</label>
                <input style={s.input} placeholder="Last name" value={form.lastName}
                       onChange={handleChange('lastName')} autoComplete="family-name"
                       onKeyDown={e => e.key === 'Enter' && handleRegister()} />
              </div>
            </div>

            <label style={s.inputLabel}>Username</label>
            <input style={s.input} placeholder="username" value={form.username}
                   onChange={handleChange('username')} autoComplete="username"
                   onKeyDown={e => e.key === 'Enter' && handleRegister()} />

            <label style={s.inputLabel}>Email</label>
            <input style={s.input} type="email" placeholder="you@email.com" value={form.email}
                   onChange={handleChange('email')} autoComplete="email"
                   onKeyDown={e => e.key === 'Enter' && handleRegister()} />

            <div style={s.row}>
              <div style={s.half}>
                <label style={s.inputLabel}>Phone</label>
                <input style={s.input} type="tel" placeholder="10-15 digits" value={form.phoneNumber}
                       onChange={handleChange('phoneNumber')} autoComplete="tel-national"
                       onKeyDown={e => e.key === 'Enter' && handleRegister()} />
              </div>
              <div style={s.half}>
                <label style={s.inputLabel}>Age</label>
                <input style={s.input} type="number" placeholder="Age" value={form.age}
                       onChange={handleChange('age')} autoComplete="off" min="13" max="120"
                       onKeyDown={e => e.key === 'Enter' && handleRegister()} />
              </div>
            </div>

            <label style={s.inputLabel}>Password</label>
            <input style={s.input} type="password" placeholder="At least 8 characters" value={form.password}
                   onChange={handleChange('password')} autoComplete="new-password"
                   onKeyDown={e => e.key === 'Enter' && handleRegister()} />

            {error && <p style={s.error}>{error}</p>}

            <button style={{ ...s.registerBtn, opacity: loading ? 0.7 : 1 }}
                    onClick={handleRegister} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerText}>or</span>
              <div style={s.dividerLine} />
            </div>

            <button style={s.backBtn} onClick={onBack}>
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>
  );
}

const s = {
  container: { minHeight: '100vh', background: 'var(--vn-bg, #FFF8EA)', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", display: 'flex', flexDirection: 'column' },
  wrapper: { display: 'flex', flex: 1 },
  mobileHeader: { background: 'var(--vn-bg, #FFF8EA)', padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  mobileHeaderSub: { color: 'var(--vn-text-sub)', fontSize: '13px', marginTop: '4px' },
  wordmark: { fontFamily: "'Archivo', 'Inter', sans-serif", fontStretch: 'expanded', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.08em', color: 'var(--vn-text)', cursor: 'pointer' },
  leftPanel: { flex: 1, background: '#0E0D0C', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', position: 'relative', overflow: 'hidden' },
  leftContent: { position: 'relative', zIndex: 2 },
  goldLine: { width: '48px', height: '1px', background: 'var(--vn-line, rgba(255,248,234,0.16))', marginBottom: '32px' },
  tagline: { color: '#FFF8EA', fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.06, margin: '0 0 16px 0', maxWidth: '460px', letterSpacing: '0.02em', textTransform: 'uppercase', fontFamily: "'Archivo', 'Inter', sans-serif" },
  rightPanel: { display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--vn-bg, #FFFFFF)', boxSizing: 'border-box', overflowY: 'auto' },
  brandName: { color: 'var(--vn-text)', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Archivo', 'Inter', sans-serif" },
  brandSub: { color: 'var(--vn-text-sub)', fontSize: '1rem', margin: '0 0 24px 0' },
  row: { display: 'flex', gap: '12px' },
  half: { flex: 1, display: 'flex', flexDirection: 'column' },
  inputLabel: { color: 'var(--vn-text-sub)', fontSize: '10px', fontWeight: '700', marginBottom: '7px', display: 'block', letterSpacing: '2px', textTransform: 'uppercase' },
  input: { padding: '12px 16px', borderRadius: 0, border: '1px solid var(--vn-line, var(--vn-card-border))', background: 'var(--vn-bg, #FFF8EA)', color: 'var(--vn-text)', fontSize: '14px', marginBottom: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  registerBtn: { padding: '14px', borderRadius: 0, border: 'none', background: 'var(--rosso)', color: '#FFF8EA', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', width: '100%', marginTop: '4px' },
  backBtn: { padding: '14px', borderRadius: 0, border: '1px solid var(--vn-line, var(--vn-card-border))', background: 'transparent', color: 'var(--vn-text)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', width: '100%' },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0' },
  dividerLine: { flex: 1, height: '1px', background: 'var(--vn-line, var(--vn-card-border))' },
  dividerText: { color: 'var(--vn-text-sub)', fontSize: '13px' },
  error: { color: '#dc2626', fontSize: '13px', margin: '0 0 14px 0', background: '#fff0f0', padding: '10px 14px', borderRadius: 0, border: '1px solid #ffd0d0' },
};

export default Register;
