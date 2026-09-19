import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './ThemeContext';
import Home from './Home';
import BusinessList from './BusinessList';
import BusinessDetail from './BusinessDetail';
import Register from './Register';
import BusinessMap from './BusinessMap';
import BusinessRegister from './BusinessRegister';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import BusinessOwnerDashboard from './BusinessOwnerDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import LandingPage from './LandingPage';
import BusinessOverview from './BusinessOverview';
import { ForgotPassword, ResetPassword } from './AuthPages';
import CustomerSettings from './CustomerSettings';
// New marketing / info pages
import ServicesPage from './ServicesPage';
import VeniarProductPage from './VeniarProductPage';
import NetworkPage from './NetworkPage';
import CustomerAppPage from './CustomerAppPage';
import MerchantDashboardPage from './MerchantDashboardPage';
import PricingPage from './PricingPage';
import SupportPage from './SupportPage';
import ContactPage from './ContactPage';
import CompanyPage from './CompanyPage';
import MissionPage from './MissionPage';
import PartnersPage from './PartnersPage';
import NewsPage from './NewsPage';
import JoinPage from './JoinPage';


function FloatingThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Dark theme active. Switch to light theme.' : 'Light theme active. Switch to dark theme.'}
      title="Toggle theme"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        border: `1px solid var(--vn-line, var(--vn-card-border, rgba(128,128,128,0.3)))`,
        background: 'var(--vn-surface, var(--vn-bg))',
        color: 'var(--vn-text, #FFF8EA)',
        borderRadius: 0,
        padding: '10px 16px',
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        lineHeight: 1,
      }}
    >
      <span style={{ color: isDark ? 'var(--rosso-soft, #F0918C)' : 'inherit', opacity: isDark ? 1 : 0.5 }}>DARK</span>
      <span style={{ opacity: 0.35 }}> / </span>
      <span style={{ color: !isDark ? 'var(--blue-soft, #9FCBEF)' : 'inherit', opacity: !isDark ? 1 : 0.5 }}>LIGHT</span>
    </button>
  );
}

function App() {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.body.style.boxSizing = 'border-box';
    document.documentElement.style.boxSizing = 'border-box';
  }, []);

  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('rn_customer');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [selectedBusiness, setSelectedBusiness] = useState(() => {
    try {
      const saved = sessionStorage.getItem('rn_business');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (customer) {
      localStorage.setItem('rn_customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('rn_customer');
    }
  }, [customer]);

  useEffect(() => {
    if (selectedBusiness) {
      sessionStorage.setItem('rn_business', JSON.stringify(selectedBusiness));
    } else {
      sessionStorage.removeItem('rn_business');
    }
  }, [selectedBusiness]);

  const handleLogin = (data) => {
    setCustomer(data);
    navigate('/home');
  };

  const handleCustomerUpdate = (updated) => {
    setCustomer(updated);
  };

  const handleLogout = () => {
    setCustomer(null);
    setSelectedBusiness(null);
    localStorage.removeItem('rn_customer');
    sessionStorage.clear();
    navigate('/');
  };

  const handleSelectBusiness = (biz) => {
    setSelectedBusiness(biz);
    navigate('/business');
  };

  const Protected = ({ children }) => {
    if (!customer) return <Navigate to="/signin" replace />;
    return children;
  };

  const StaffRoute = ({ children }) => {
    if (customer) return <Navigate to="/home" replace />;
    return children;
  };

  const BusinessDetailWrapper = () => {
    if (!selectedBusiness) return <Navigate to="/businesses" replace />;
    return (
      <BusinessDetail
        business={selectedBusiness}
        customer={customer}
        onBack={() => navigate('/businesses')}
        onLogout={handleLogout}
        onRefresh={() => setRefreshKey(k => k + 1)}
      />
    );
  };

  return (
    <ThemeProvider>
    <FloatingThemeToggle />
    <Routes>
      {/* Public marketing pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/aboutus" element={<VeniarProductPage />} />
      <Route path="/veniar" element={<Navigate to="/aboutus" replace />} />
      <Route path="/network" element={<NetworkPage />} />
      <Route path="/customer-app" element={<CustomerAppPage />} />
      <Route path="/merchant-dashboard" element={<MerchantDashboardPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/company" element={<CompanyPage />} />
      <Route path="/mission" element={<MissionPage />} />
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/join" element={<JoinPage />} />

      {/* Auth */}
      <Route path="/signin" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onRegister={handleLogin} onBack={() => navigate('/signin')} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Business info & onboarding */}
      <Route path="/business-overview" element={<BusinessOverview />} />
      <Route path="/business-register" element={<BusinessRegister onBack={() => navigate('/business-overview')} onSuccess={() => setRefreshKey(k => k + 1)} />} />

      {/* Authenticated customer routes */}
      <Route path="/home" element={<Protected><Home customer={customer} onLogout={handleLogout} onNavigate={navigate} refreshKey={refreshKey} /></Protected>} />
      <Route path="/settings" element={<Protected><CustomerSettings customer={customer} onCustomerUpdate={handleCustomerUpdate} onLogout={handleLogout} /></Protected>} />
      <Route path="/businesses" element={<Protected><BusinessList key={refreshKey} customer={customer} onLogout={handleLogout} onSelectBusiness={handleSelectBusiness} onNavigate={navigate} /></Protected>} />
      <Route path="/business" element={<Protected><BusinessDetailWrapper /></Protected>} />
      <Route path="/map" element={<Protected><BusinessMap key={refreshKey} customer={customer} onLogout={handleLogout} onNavigate={navigate} onSelectBusiness={handleSelectBusiness} /></Protected>} />

      {/* Staff / admin portals */}
      <Route path="/admin" element={<StaffRoute><AdminDashboard /></StaffRoute>} />
      <Route path="/business-owner" element={<StaffRoute><BusinessOwnerDashboard /></StaffRoute>} />
      <Route path="/employee" element={<StaffRoute><EmployeeDashboard /></StaffRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </ThemeProvider>
  );
}

export default App;
