// AuthPages.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from './config';
import { useIsMobile } from './useIsMobile';

export function ForgotPassword() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) { setError('Enter your email address'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      if (!res.ok) {
        setError('We could not send the reset link. Please try again.');
        return;
      }
      setEmail(normalizedEmail);
      setSent(true);
    } catch {
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={s.root}>
        <div style={{ ...s.card, padding: isMobile ? '32px 24px' : '48px', maxWidth: isMobile ? '100%' : '420px', minHeight: isMobile ? '100vh' : 'auto' }}>
          <span style={{ ...s.wordmark, display: 'block', marginBottom: '12px' }} onClick={() => navigate('/')}>VENIAR</span>
          <button style={s.backLink} onClick={() => navigate('/signin')}>← Back to sign in</button>
          {!sent ? (
              <>
                <h1 style={s.title}>Reset your password</h1>
                <p style={s.sub}>Enter the email address on your account and we'll send a reset link.</p>
                <label style={s.label}>Email address</label>
                <input style={s.input} type="email" autoComplete="email"
                       placeholder="you@email.com" value={email}
                       onChange={e => setEmail(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                {error && <p style={s.error}>{error}</p>}
                <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </>
          ) : (
              <div style={s.success}>
                <div style={s.successIcon}>✓</div>
                <h1 style={s.title}>Check your email</h1>
                <p style={s.sub}>
                  If an account exists for <strong>{email}</strong>, you'll receive a reset link shortly.
                  Check your spam folder if you don't see it.
                </p>
                <button style={s.btn} onClick={() => navigate('/signin')}>Back to sign in</button>
              </div>
          )}
        </div>
      </div>
  );
}

export function ResetPassword() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const token = new URLSearchParams(window.location.search).get('token')?.trim() || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(token ? '' : 'Invalid or expired reset link');

  const handleReset = async () => {
    if (!password || password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (!token) { setError('Invalid or expired reset link'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setError(data.error || data.message || 'This reset link is invalid or has expired.');
        return;
      }
      setDone(true);
    } catch {
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={s.root}>
        <div style={{ ...s.card, padding: isMobile ? '32px 24px' : '48px', maxWidth: isMobile ? '100%' : '420px', minHeight: isMobile ? '100vh' : 'auto' }}>
          <span style={{ ...s.wordmark, display: 'block', marginBottom: '12px' }} onClick={() => navigate('/')}>VENIAR</span>
          {!done ? (
              <>
                <h1 style={s.title}>Choose a new password</h1>
                <p style={s.sub}>Pick something strong that you haven't used before.</p>
                <label style={s.label}>New password</label>
                <input style={s.input} type="password" autoComplete="new-password"
                       placeholder="At least 8 characters" value={password}
                       onChange={e => setPassword(e.target.value)} />
                <label style={s.label}>Confirm new password</label>
                <input style={s.input} type="password" autoComplete="new-password"
                       placeholder="••••••••" value={confirm}
                       onChange={e => setConfirm(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && handleReset()} />
                {error && <p style={s.error}>{error}</p>}
                <button style={{ ...s.btn, opacity: loading || !token ? 0.7 : 1 }} onClick={handleReset} disabled={loading || !token}>
                  {loading ? 'Updating password…' : 'Set new password'}
                </button>
              </>
          ) : (
              <div style={s.success}>
                <div style={s.successIcon}>✓</div>
                <h1 style={s.title}>Password updated</h1>
                <p style={s.sub}>Your password has been changed. You can now sign in with your new password.</p>
                <button style={s.btn} onClick={() => navigate('/signin')}>Sign in</button>
              </div>
          )}
        </div>
      </div>
  );
}

const s = {
  root: { minHeight: '100vh', background: 'var(--vn-bg, #FFF8EA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", padding: '24px', position: 'relative' },
  card: { background: 'var(--vn-surface, #FFFFFF)', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 2, border: '1px solid var(--vn-line, var(--vn-card-border))' },
  wordmark: { fontFamily: "'Archivo', 'Inter', sans-serif", fontStretch: 'expanded', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.08em', color: 'var(--vn-text)', cursor: 'pointer' },
  backLink: { background: 'none', border: 'none', color: 'var(--rosso)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0, marginBottom: '28px', display: 'block' },
  title: { color: 'var(--vn-text)', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 8px', letterSpacing: '0.03em', textTransform: 'uppercase', fontFamily: "'Archivo', 'Inter', sans-serif" },
  sub: { color: 'var(--vn-text-sub)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 28px' },
  label: { display: 'block', color: 'var(--vn-text-sub)', fontSize: '10px', fontWeight: '700', marginBottom: '7px', letterSpacing: '2px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '13px 16px', border: '1px solid var(--vn-line, var(--vn-card-border))', borderRadius: 0, fontSize: '14px', color: 'var(--vn-text)', background: 'var(--vn-bg, #FFF8EA)', outline: 'none', boxSizing: 'border-box', marginBottom: '20px' },
  error: { color: '#dc2626', fontSize: '13px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 0, padding: '10px 14px', margin: '0 0 16px' },
  btn: { width: '100%', padding: '14px', background: 'var(--rosso)', color: '#FFF8EA', border: 'none', borderRadius: 0, fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' },
  success: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' },
  successIcon: { width: '56px', height: '56px', borderRadius: 0, background: 'var(--rosso)', color: '#FFF8EA', fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};
