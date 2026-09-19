import { createContext, useContext, useState, useEffect } from 'react';

const ThemeCtx = createContext({ isDark: true, toggleTheme: () => {} });

// ── Veniar Ocean Breeze — existing --rn-* vars kept for app pages ─────────
// New --vn-* contextual vars follow the Ocean Breeze palette

const DARK = {
  '--rn-bg':                '#07243A',
  '--rn-nav-bg':            'rgba(7,36,58,0.97)',
  '--rn-nav-border':        'rgba(255,255,255,0.07)',
  '--rn-text':              '#F5F0E8',
  '--rn-text-sub':          'rgba(245,240,232,0.66)',
  '--rn-text-muted':        'rgba(245,240,232,0.42)',
  '--rn-text-faint':        'rgba(245,240,232,0.28)',
  '--rn-card-bg':           'rgba(255,255,255,0.05)',
  '--rn-card-border':       'rgba(255,255,255,0.09)',
  '--rn-card-border-lg':    'rgba(255,255,255,0.12)',
  '--rn-section-alt':       'rgba(0,0,0,0.22)',
  '--rn-section-border':    'rgba(255,255,255,0.07)',
  '--rn-ghost-border':      'rgba(245,240,232,0.28)',
  '--rn-ghost-color':       '#F5F0E8',
  '--rn-ghost-hover-bg':    'rgba(245,240,232,0.06)',
  '--rn-nav-btn-border':    'rgba(245,240,232,0.18)',
  '--rn-nav-btn-color':     '#F5F0E8',
  '--rn-nav-hover-bg':      'rgba(245,240,232,0.06)',
  '--rn-muted-btn-color':   'rgba(245,240,232,0.50)',
  '--rn-orb1':              'transparent',
  '--rn-orb2':              'transparent',
  '--rn-orb3':              'transparent',
  '--rn-emp-orb2':          'transparent',
  '--rn-callout-title':     '#F2B84B',
  '--rn-portal-bg':         '#052030',
  '--rn-portal-surface':    'rgba(255,255,255,0.06)',
  '--rn-portal-topbar':     'rgba(5,32,48,0.97)',
  '--rn-portal-border':     'rgba(255,255,255,0.10)',
  '--rn-portal-text':       '#F5F0E8',
  '--rn-portal-text-sub':   'rgba(245,240,232,0.60)',
  '--rn-portal-text-muted': 'rgba(245,240,232,0.38)',
  '--rn-portal-input-bg':   'rgba(255,255,255,0.07)',
  '--rn-portal-input-border':'rgba(255,255,255,0.15)',
  '--rn-portal-input-color':'#e2e8f0',
  '--rn-form-bg':           '#052030',
  '--rn-form-text':         '#F5F0E8',
  '--rn-form-sub':          'rgba(245,240,232,0.60)',
  '--rn-input-bg':          'rgba(255,255,255,0.07)',
  '--rn-input-border':      'rgba(255,255,255,0.14)',
  '--rn-input-color':       '#e2e8f0',
  '--rn-outline-btn-bg':    'rgba(255,255,255,0.06)',
  '--rn-outline-btn-border':'rgba(255,255,255,0.18)',
  '--rn-outline-btn-color': 'rgba(245,240,232,0.85)',
  '--rn-divider':           'rgba(255,255,255,0.10)',
  '--rn-beam-mid':          'rgba(0,169,200,0.18)',
  '--rn-rail':              'rgba(255,255,255,0.04)',
  '--rn-dark-band':         '#07131A',
  // Veniar 2.0 "cinematic luxury" contextual vars — dark mode (default)
  '--vn-bg':                '#0E0D0C',
  '--vn-surface':           '#171514',
  '--vn-panel':             '#171514',
  '--vn-panel-strong':      '#201D1B',
  '--vn-text':              '#FFF8EA',
  '--vn-text-sub':          '#B5ACA0',
  '--vn-text-muted':        'rgba(181,172,160,0.65)',
  '--vn-card':              '#171514',
  '--vn-card-border':       'rgba(255,248,234,0.16)',
  '--vn-line':              'rgba(255,248,234,0.16)',
  '--vn-nav-bg':            'rgba(14,13,12,0.92)',
  '--vn-nav-border':        'rgba(255,248,234,0.16)',
  '--vn-section-alt':       '#0B0A09',
  '--vn-divider':           'rgba(255,248,234,0.16)',
  '--vn-accent':            '#D40000',
  '--vn-accent-hover':      '#A80000',
  '--vn-gold':              '#E8B04A',
  '--bg':                   '#0E0D0C',
  '--surface':              '#171514',
  '--text':                 '#FFF8EA',
  '--muted':                '#B5ACA0',
  '--line':                 'rgba(255,248,234,0.16)',
};

const LIGHT = {
  '--rn-bg':                '#FFF8EA',
  '--rn-nav-bg':            'rgba(255,255,255,0.97)',
  '--rn-nav-border':        'rgba(16,24,32,0.10)',
  '--rn-text':              '#101820',
  '--rn-text-sub':          '#374151',
  '--rn-text-muted':        'rgba(16,24,32,0.48)',
  '--rn-text-faint':        'rgba(16,24,32,0.30)',
  '--rn-card-bg':           '#FFFFFF',
  '--rn-card-border':       'rgba(16,24,32,0.10)',
  '--rn-card-border-lg':    'rgba(16,24,32,0.13)',
  '--rn-section-alt':       '#F7F1E3',
  '--rn-section-border':    'rgba(16,24,32,0.08)',
  '--rn-ghost-border':      '#1677B8',
  '--rn-ghost-color':       '#1677B8',
  '--rn-ghost-hover-bg':    'rgba(22,119,184,0.06)',
  '--rn-nav-btn-border':    'rgba(16,24,32,0.14)',
  '--rn-nav-btn-color':     '#101820',
  '--rn-nav-hover-bg':      'rgba(16,24,32,0.05)',
  '--rn-muted-btn-color':   'rgba(16,24,32,0.48)',
  '--rn-orb1':              'transparent',
  '--rn-orb2':              'transparent',
  '--rn-orb3':              'transparent',
  '--rn-emp-orb2':          'transparent',
  '--rn-callout-title':     '#06445E',
  '--rn-portal-bg':         '#FFF8EA',
  '--rn-portal-surface':    '#FFFFFF',
  '--rn-portal-topbar':     '#FFFFFF',
  '--rn-portal-border':     'rgba(16,24,32,0.10)',
  '--rn-portal-text':       '#101820',
  '--rn-portal-text-sub':   '#5F6B73',
  '--rn-portal-text-muted': 'rgba(16,24,32,0.38)',
  '--rn-portal-input-bg':   '#FFFFFF',
  '--rn-portal-input-border':'rgba(16,24,32,0.18)',
  '--rn-portal-input-color':'#101820',
  '--rn-form-bg':           '#E6F8F6',
  '--rn-form-text':         '#101820',
  '--rn-form-sub':          '#1677B8',
  '--rn-input-bg':          '#FFFFFF',
  '--rn-input-border':      'rgba(22,119,184,0.28)',
  '--rn-input-color':       '#101820',
  '--rn-outline-btn-bg':    'rgba(22,119,184,0.05)',
  '--rn-outline-btn-border':'rgba(22,119,184,0.30)',
  '--rn-outline-btn-color': '#1677B8',
  '--rn-divider':           'rgba(16,24,32,0.10)',
  '--rn-beam-mid':          'rgba(0,169,200,0.09)',
  '--rn-rail':              'rgba(0,169,200,0.04)',
  '--rn-dark-band':         '#06445E',
  // Veniar 2.0 "cinematic luxury" contextual vars — light mode
  '--vn-bg':                '#FFF8EA',
  '--vn-surface':           '#F1E6CF',
  '--vn-panel':             '#F1E6CF',
  '--vn-panel-strong':      '#E8DABF',
  '--vn-text':              '#141210',
  '--vn-text-sub':          '#5F564B',
  '--vn-text-muted':        'rgba(95,86,75,0.70)',
  '--vn-card':              '#F1E6CF',
  '--vn-card-border':       'rgba(20,18,16,0.14)',
  '--vn-line':              'rgba(20,18,16,0.14)',
  '--vn-nav-bg':            'rgba(255,248,234,0.92)',
  '--vn-nav-border':        'rgba(20,18,16,0.14)',
  '--vn-section-alt':       '#F7F1E3',
  '--vn-divider':           'rgba(20,18,16,0.14)',
  '--vn-accent':            '#D40000',
  '--vn-accent-hover':      '#A80000',
  '--vn-gold':              '#E8B04A',
  '--bg':                   '#FFF8EA',
  '--surface':              '#F1E6CF',
  '--text':                 '#141210',
  '--muted':                '#5F564B',
  '--line':                 'rgba(20,18,16,0.14)',
};

function applyVars(isDark) {
  const vars = isDark ? DARK : LIGHT;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('rn_theme');
      const dark = saved !== 'light';
      applyVars(dark);
      return dark;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    applyVars(isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      try { localStorage.setItem('rn_theme', next ? 'dark' : 'light'); } catch {}
      return next;
    });
  };

  return (
    <ThemeCtx.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
