const venues = [
  { x: 92, y: 92, label: 'Coffee', color: 'var(--rosso)', icon: 'cup' },
  { x: 325, y: 76, label: 'Market', color: 'var(--blue)', icon: 'bag' },
  { x: 342, y: 224, label: 'Dining', color: 'var(--rosso)', icon: 'fork' },
  { x: 104, y: 246, label: 'Shops', color: 'var(--blue)', icon: 'shop' },
];

function VenueIcon({ type }) {
  if (type === 'cup') {
    return (
      <>
        <path d="M-7 -4h11v7a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" />
        <path d="M4 -2h2.5a3 3 0 0 1 0 6H4M-8 10H5" />
      </>
    );
  }

  if (type === 'bag') {
    return (
      <>
        <path d="M-7 -3h14l-1 12H-6z" />
        <path d="M-3 -3v-2a3 3 0 0 1 6 0v2" />
      </>
    );
  }

  if (type === 'fork') {
    return (
      <>
        <path d="M-5 -8v7M-1 -8v7M-5 -4h4M-3 -1v10" />
        <path d="M5 -8v17M5 -8c4 3 4 7 0 9" />
      </>
    );
  }

  return (
    <>
      <path d="M-8 -2h16v11H-8zM-10 -2l2-6H8l2 6" />
      <path d="M-3 9V3h6v6M-8 -2c0 3 4 3 4 0 0 3 4 3 4 0 0 3 4 3 4 0 0 3 4 3 4 0" />
    </>
  );
}

export default function NetworkVisual() {
  return (
    <div className="vn-network-card">
      <svg
        className="vn-discovery-map"
        viewBox="0 0 420 320"
        width="100%"
        role="img"
        aria-label="A neighborhood map showing nearby coffee, market, dining, and shopping destinations"
      >
        <defs>
          <pattern id="vn-map-grain" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#0F6356" opacity="0.09" />
          </pattern>
        </defs>

        <rect width="420" height="320" rx="18" fill="#F7E8CF" />
        <rect width="420" height="320" rx="18" fill="url(#vn-map-grain)" />

        <g className="vn-map-blocks" fill="#E6D7BD">
          <rect x="22" y="18" width="98" height="54" rx="8" />
          <rect x="151" y="18" width="76" height="65" rx="8" />
          <rect x="259" y="18" width="139" height="43" rx="8" />
          <rect x="20" y="126" width="62" height="77" rx="8" />
          <rect x="111" y="125" width="92" height="53" rx="8" />
          <rect x="239" y="106" width="70" height="71" rx="8" />
          <rect x="340" y="104" width="58" height="68" rx="8" />
          <rect x="18" y="279" width="123" height="24" rx="8" />
          <rect x="177" y="219" width="78" height="84" rx="8" />
          <rect x="287" y="269" width="111" height="34" rx="8" />
        </g>

        <g className="vn-map-streets" fill="none" stroke="#FFF8EA" strokeLinecap="round">
          <path d="M-10 96C80 105 134 95 221 97s137-7 209-20" strokeWidth="24" />
          <path d="M96-10c9 64 5 119 1 178s8 108 19 164" strokeWidth="22" />
          <path d="M244-10c3 56-5 101-10 155s3 117 9 187" strokeWidth="20" />
          <path d="M326-10c-3 81-2 135 3 189s-2 103-8 153" strokeWidth="18" />
          <path d="M-10 232c80-13 143-11 210-7s142 13 230-2" strokeWidth="24" />
        </g>

        <path
          className="vn-discovery-route"
          d="M209 166C175 132 136 114 92 92M211 166c40-55 72-77 114-90M211 167c54 10 91 27 131 57M209 168c-38 30-68 53-105 78"
          fill="none"
          stroke="var(--rosso)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="5 8"
        />

        <circle className="vn-discovery-radius" cx="210" cy="166" r="76" fill="none" stroke="var(--rosso)" strokeWidth="1.5" strokeDasharray="4 7" />

        {venues.map((venue) => (
          <g key={venue.label} className="vn-map-venue" transform={`translate(${venue.x} ${venue.y})`}>
            <circle r="22" fill="#FFF8EA" stroke={venue.color} strokeWidth="2" />
            <g fill="none" stroke={venue.color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <VenueIcon type={venue.icon} />
            </g>
            <rect x="-29" y="29" width="58" height="22" rx="11" fill="#101820" />
            <text y="44" textAnchor="middle" fill="#FFF8EA" fontSize="10" fontWeight="700">
              {venue.label}
            </text>
          </g>
        ))}

        <g className="vn-map-center" transform="translate(210 166)">
          <circle r="30" fill="var(--rosso)" opacity="0.16" />
          <circle r="18" fill="var(--rosso)" />
          <circle r="6" fill="#FFF8EA" />
          <path d="M0 25l-6-9h12z" fill="var(--rosso)" />
          <rect x="-20" y="36" width="40" height="21" rx="10.5" fill="#101820" />
          <text y="50" textAnchor="middle" fill="#FFF8EA" fontSize="10" fontWeight="700">
            You
          </text>
        </g>
      </svg>
    </div>
  );
}
