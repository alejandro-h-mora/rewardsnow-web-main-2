import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from './useIsMobile';
import { API } from './config';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Please enter your email and password'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email address'); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.error) {
        setError('Username or Password Incorrect');
      } else {
        onLogin(data);
      }
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={styles.container}>
        <div style={{ ...styles.loginWrapper, flexDirection: isMobile ? 'column' : 'row' }}>

          {isMobile ? (
              <div style={styles.mobileHeader}>
                <span style={styles.wordmark} onClick={() => navigate('/')}>VENIAR</span>
                <span style={styles.mobileHeaderSub}>Earn rewards everywhere</span>
              </div>
          ) : (
              <div style={styles.leftPanel}>
              <div style={styles.leftContent}>
                  <span style={{ ...styles.wordmark, color: '#FFF8EA', display: 'block', marginBottom: '24px' }} onClick={() => navigate('/')}>VENIAR</span>
                  <div style={styles.goldLine} />
                  <p style={styles.tagline}>Earn rewards while supporting local businesses.</p>
                  <p style={styles.leftDesc}>Discover participating restaurants, cafés, shops, and local services. Earn and redeem rewards across the <em>Veniar</em> Network.</p>
                </div>
              </div>
          )}

          <div style={{
            ...styles.rightPanel,
            width: isMobile ? '100%' : '500px',
            padding: isMobile ? '32px 24px 48px' : '80px 64px',
            borderLeft: isMobile ? 'none' : '1px solid var(--vn-line, var(--vn-card-border))',
            flex: isMobile ? '1' : 'none',
          }}>
            <h1 style={{ ...styles.brandName, fontSize: isMobile ? '1.8rem' : '2.2rem' }}>Welcome back</h1>
            <p style={styles.brandSub}>Sign in to your Veniar account</p>
            <label style={styles.inputLabel}>Email</label>
            <input style={styles.input} type="email" placeholder="you@email.com"
                   value={email} onChange={e => setEmail(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <label style={styles.inputLabel}>Password</label>
            <input style={styles.input} type="password" placeholder="••••••••"
                   value={password} onChange={e => setPassword(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            {error && <p style={styles.error}>{error}</p>}
            <button style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}
                    onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <button type="button" style={styles.forgotLink} onClick={() => navigate('/forgot-password')}>
                Forgot password?
              </button>
            </div>
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or</span>
              <div style={styles.dividerLine} />
            </div>
            <button style={styles.registerBtn} onClick={() => navigate('/register')}>
              Create an Account
            </button>
            <button style={styles.bizRegisterBtn} onClick={() => navigate('/business-overview')}>
              Own a business?
            </button>
            <p style={styles.terms}>
              By signing in you agree to our{' '}
              <span style={styles.link} onClick={() => navigate('/terms')}>Terms of Service</span> and{' '}
              <span style={styles.link} onClick={() => navigate('/privacy')}>Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: 'var(--vn-bg, #FFF8EA)', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", display: 'flex', flexDirection: 'column' },
  loginWrapper: { display: 'flex', flex: 1, minHeight: 0 },
  mobileHeader: { background: 'var(--vn-bg, #FFF8EA)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  mobileHeaderSub: { color: 'var(--vn-text-sub, #5F6B73)', fontSize: '13px', marginTop: '4px' },
  wordmark: { fontFamily: "'Archivo', 'Inter', sans-serif", fontStretch: 'expanded', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.08em', color: 'var(--vn-text)', cursor: 'pointer' },
  leftPanel: { flex: 1, background: '#0E0D0C', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', position: 'relative', overflow: 'hidden' },
  leftContent: { position: 'relative', zIndex: 2 },
  goldLine: { width: '48px', height: '1px', background: 'var(--vn-line, rgba(255,248,234,0.16))', marginBottom: '32px' },
  tagline: { color: '#FFF8EA', fontSize: '3rem', fontWeight: 800, lineHeight: 1.06, margin: '0 0 20px 0', maxWidth: '460px', letterSpacing: '0.02em', textTransform: 'uppercase', fontFamily: "'Archivo', 'Inter', sans-serif" },
  leftDesc: { color: 'rgba(255,248,234,0.65)', fontSize: '15px', lineHeight: 1.7, margin: 0, maxWidth: '360px' },
  rightPanel: { display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--vn-bg, #FFFFFF)', boxSizing: 'border-box' },
  brandName: { color: 'var(--vn-text)', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'Archivo', 'Inter', sans-serif" },
  brandSub: { color: 'var(--vn-text-sub)', fontSize: '1rem', margin: '0 0 36px 0' },
  inputLabel: { color: 'var(--vn-text-sub)', fontSize: '10px', fontWeight: '700', marginBottom: '7px', display: 'block', letterSpacing: '2px', textTransform: 'uppercase' },
  input: { padding: '14px 16px', borderRadius: 0, border: '1px solid var(--vn-line, var(--vn-card-border))', background: 'var(--vn-bg, #FFF8EA)', color: 'var(--vn-text)', fontSize: '15px', marginBottom: '20px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  loginBtn: { padding: '16px', borderRadius: 0, border: 'none', background: 'var(--rosso)', color: '#FFF8EA', fontSize: '13px', fontWeight: 700, cursor: 'pointer', width: '100%', letterSpacing: '0.08em', textTransform: 'uppercase' },
  forgotLink: { background: 'none', border: 'none', padding: 0, color: 'var(--rosso)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  registerBtn: { padding: '15px', borderRadius: 0, border: '1px solid var(--vn-line, var(--vn-card-border))', background: 'transparent', color: 'var(--vn-text)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', width: '100%' },
  bizRegisterBtn: { padding: '15px', borderRadius: 0, border: '1px solid var(--vn-line, var(--vn-card-border))', background: 'transparent', color: 'var(--vn-text)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', width: '100%', marginTop: '10px' },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' },
  dividerLine: { flex: 1, height: '1px', background: 'var(--vn-line, var(--vn-card-border))' },
  dividerText: { color: 'var(--vn-text-sub)', fontSize: '13px' },
  error: { color: '#dc2626', fontSize: '13px', margin: '0 0 14px 0', background: '#fff0f0', padding: '10px 14px', borderRadius: 0, border: '1px solid #ffd0d0' },
  terms: { color: 'var(--vn-text-sub)', fontSize: '12px', textAlign: 'center', marginTop: '20px', lineHeight: 1.6 },
  link: { color: 'var(--rosso)', cursor: 'pointer' },
};

export default Login;
