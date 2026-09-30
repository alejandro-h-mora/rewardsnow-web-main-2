export default function Eyebrow({ children, style = {}, tag: Tag = 'p' }) {
  return (
    <Tag className="vn-eyebrow" style={style}>
      {children}
    </Tag>
  );
}
