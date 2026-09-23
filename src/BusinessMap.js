import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useIsMobile } from './useIsMobile';
import { API } from './config';

const ROYAL = 'var(--rosso)';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

async function geocodeAddress(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en-US,en' } });
    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch {}
  return null;
}

function BusinessMap({ customer, onLogout, onNavigate, onSelectBusiness }) {
  const isMobile = useIsMobile();
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [mappedBusinesses, setMappedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [userLocation, setUserLocation] = useState([26.35, -80.08]);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const cancelRef = useRef(false);

  useEffect(() => {
    cancelRef.current = false;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
          () => {}
      );
    }

    const run = async () => {
      try {
        const res = await fetch(`${API}/businesses`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setAllBusinesses(list);
        setLoading(false);

        const withAddress = list.filter(b => b.address);
        if (withAddress.length === 0) return;

        setGeocoding(true);
        for (const biz of withAddress) {
          if (cancelRef.current) break;
          const coords = await geocodeAddress(biz.address);
          if (coords && !cancelRef.current) {
            setMappedBusinesses(prev => [...prev, { ...biz, coords }]);
          }
          // Nominatim rate limit: max 1 req/sec
          await new Promise(r => setTimeout(r, 1100));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setGeocoding(false);
      }
    };

    run();

    return () => { cancelRef.current = true; };
  }, []);

  return (
      <div style={s.container}>
        <div style={s.topBar}>
          <span style={s.logo}>Veniar</span>
          <div style={s.topBarRight}>
            {!isMobile && (
                <>
                  <button style={s.navBtn} onClick={() => onNavigate('/home')}>Home</button>
                  <button style={s.navBtn} onClick={() => onNavigate('/businesses')}>List</button>
                </>
            )}
            <button style={s.navBtn} onClick={() => setShowSidebar(v => !v)}>
              {showSidebar ? (isMobile ? '✕ Close' : 'Hide list') : '☰ Nearby'}
            </button>
            <button style={s.logoutBtn} onClick={onLogout}>{isMobile ? '↩' : 'Log Out'}</button>
          </div>
        </div>

        <div style={{ ...s.body, flexDirection: isMobile ? 'column' : 'row' }}>
          {showSidebar && (
              <div style={{
                ...s.sidebar,
                width: isMobile ? '100%' : '300px',
                maxHeight: isMobile ? '45vh' : 'none',
                borderRight: isMobile ? 'none' : '1px solid #eee',
                borderBottom: isMobile ? '1px solid #eee' : 'none',
                flexShrink: isMobile ? 0 : undefined,
              }}>
                <h2 style={s.sidebarTitle}>Nearby Partners</h2>
                <p style={s.sidebarSub}>
                  {geocoding
                      ? `Locating businesses… (${mappedBusinesses.length}/${allBusinesses.filter(b => b.address).length})`
                      : 'Tap a business or map pin to view rewards'}
                </p>
                {loading ? (
                    <div style={s.skeletonList}>
                      {[1, 2, 3].map(i => <div key={i} style={s.skeleton} />)}
                    </div>
                ) : allBusinesses.length === 0 ? (
                    <div style={s.emptyState}>
                      <p style={s.emptyText}>No businesses yet.</p>
                    </div>
                ) : (
                    <div style={s.bizList}>
                      {allBusinesses.map((biz) => {
                        const mapped = mappedBusinesses.find(m => m.id === biz.id);
                        return (
                            <div
                                key={biz.id}
                                style={{ ...s.bizCard, opacity: biz.address ? 1 : 0.55 }}
                                onClick={() => onSelectBusiness(biz)}
                                onMouseEnter={e => e.currentTarget.style.borderColor = ROYAL}
                                onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
                            >
                              <div style={{ ...s.bizInitial, background: mapped ? 'linear-gradient(135deg, #152a9e, #1e35b5)' : '#9ca3af' }}>
                                {biz.name.charAt(0).toUpperCase()}
                              </div>
                              <div style={s.bizMeta}>
                                <p style={s.bizName}>{biz.name}</p>
                                <p style={s.bizAddress}>{biz.address || 'No address on file'}</p>
                                {biz.paidPartner && <span style={s.featuredPill}>Featured</span>}
                              </div>
                              {mapped && <span style={s.pinDot} title="Shown on map" />}
                            </div>
                        );
                      })}
                    </div>
                )}
              </div>
          )}

          <div style={{ ...s.mapWrapper, flex: 1, minHeight: isMobile ? (showSidebar ? '55vh' : 'calc(100vh - 60px)') : 'auto' }}>
            {!loading && (
                <MapContainer center={userLocation} zoom={13} style={{ width: '100%', height: '100%' }}>
                  <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {mappedBusinesses.map((biz) => (
                      <Marker key={biz.id} position={biz.coords}>
                        <Popup>
                          <div style={s.popup}>
                            <strong style={s.popupName}>{biz.name}</strong>
                            {biz.address && <p style={s.popupAddress}>{biz.address}</p>}
                            <button style={s.popupBtn} onClick={() => onSelectBusiness(biz)}>
                              View Rewards →
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                  ))}
                </MapContainer>
            )}
            {loading && (
                <div style={s.mapLoading}>
                  <p style={{ color: '#888', fontSize: '14px' }}>Loading map...</p>
                </div>
            )}
            {!loading && geocoding && mappedBusinesses.length === 0 && (
                <div style={s.geocodingOverlay}>
                  <p style={s.geocodingText}>Locating businesses on map…</p>
                </div>
            )}
          </div>
        </div>

        {isMobile && (
            <div style={s.mobileBottomNav}>
              <button style={s.mobileNavBtn} onClick={() => onNavigate('/home')}>🏠 Home</button>
              <button style={s.mobileNavBtn} onClick={() => onNavigate('/businesses')}>📋 List</button>
              <button style={{ ...s.mobileNavBtn, color: ROYAL, fontWeight: '700' }}>🗺️ Map</button>
            </div>
        )}
      </div>
  );
}

const s = {
  container: { height: '100vh', background: 'var(--rn-bg)', fontFamily: "'Segoe UI', system-ui, sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', height: '56px', background: 'var(--rn-nav-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--rn-nav-border)', zIndex: 1000, position: 'relative', flexShrink: 0 },
  logo: { color: ROYAL, fontSize: '1.2rem', fontWeight: '800' },
  topBarRight: { display: 'flex', alignItems: 'center', gap: '6px' },
  navBtn: { padding: '6px 10px', borderRadius: 0, border: '1.5px solid var(--rn-nav-border)', background: 'transparent', color: ROYAL, cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  logoutBtn: { padding: '6px 12px', borderRadius: 0, border: '1.5px solid var(--rn-nav-border)', background: 'transparent', color: 'var(--rn-text-sub)', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  body: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: { background: 'var(--rn-form-bg)', padding: '16px', overflowY: 'auto', zIndex: 10 },
  sidebarTitle: { color: ROYAL, fontSize: '1.1rem', fontWeight: '800', margin: '0 0 4px 0' },
  sidebarSub: { color: 'var(--rn-text-muted)', fontSize: '12px', margin: '0 0 14px 0' },
  skeletonList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  skeleton: { height: '56px', borderRadius: 0, background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' },
  emptyState: { textAlign: 'center', padding: '24px 0' },
  emptyText: { color: 'var(--rn-text-muted)', fontSize: '13px' },
  bizList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  bizCard: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 0, border: '1.5px solid var(--rn-card-border)', cursor: 'pointer', transition: 'border-color 0.2s' },
  bizInitial: { width: '36px', height: '36px', borderRadius: 0, color: '#ffffff', fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bizMeta: { flex: 1, minWidth: 0 },
  bizName: { color: 'var(--rn-text)', fontSize: '13px', fontWeight: '700', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  bizAddress: { color: 'var(--rn-text-muted)', fontSize: '11px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  featuredPill: { background: '#fff8e1', color: '#7a5500', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: 0, marginTop: '4px', display: 'inline-block' },
  pinDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 },
  mapWrapper: { position: 'relative', minWidth: 0 },
  mapLoading: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--rn-bg)' },
  geocodingOverlay: { position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.65)', borderRadius: 0, padding: '8px 18px', zIndex: 500, pointerEvents: 'none' },
  geocodingText: { color: '#fff', fontSize: '13px', margin: 0 },
  popup: { fontFamily: "'Segoe UI', system-ui, sans-serif", minWidth: '160px', maxWidth: '220px' },
  popupName: { color: ROYAL, fontSize: '14px', display: 'block', marginBottom: '4px', fontWeight: '700' },
  popupAddress: { color: '#888', fontSize: '12px', margin: '0 0 10px 0' },
  popupBtn: { padding: '7px 12px', borderRadius: 0, border: 'none', background: ROYAL, color: '#ffffff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', width: '100%' },
  mobileBottomNav: { display: 'flex', borderTop: '1px solid var(--rn-nav-border)', background: 'var(--rn-nav-bg)', flexShrink: 0 },
  mobileNavBtn: { flex: 1, padding: '12px', background: 'none', border: 'none', fontSize: '12px', fontWeight: '500', color: 'var(--rn-text-sub)', cursor: 'pointer' },
};

export default BusinessMap;
