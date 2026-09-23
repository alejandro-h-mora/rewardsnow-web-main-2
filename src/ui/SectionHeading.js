const SIZES = {
  sm: 'clamp(1.8rem, 3.2vw, 2.4rem)',
  md: 'clamp(2.2rem, 5vw, 3.6rem)',
  lg: 'clamp(3rem, 9vw, 9rem)',
};

export default function SectionHeading({ children, as: Tag = 'h2', size = 'md', style = {} }) {
  return (
    <Tag
      className="vn-display"
      style={{
        fontSize: SIZES[size] || SIZES.md,
        letterSpacing: '0.06em',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
