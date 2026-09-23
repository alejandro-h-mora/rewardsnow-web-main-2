export default function Numeral({ children, size = 64, filled = false, style = {}, className = '' }) {
  return (
    <span
      className={`vn2-numeral ${filled ? 'vn2-numeral-filled' : ''} ${className}`}
      style={{
        display: 'inline-block',
        fontFamily: "'Archivo', 'Inter', sans-serif",
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: '0.01em',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
