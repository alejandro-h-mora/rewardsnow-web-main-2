export default function Hairline({ style = {}, vertical = false }) {
  return (
    <div
      aria-hidden="true"
      style={{
        background: 'var(--vn-line, var(--vn-card-border))',
        width: vertical ? 1 : '100%',
        height: vertical ? '100%' : 1,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
