import { useEffect, useRef, useState } from 'react';

const noMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fade-up-on-entry wrapper for the "cinematic luxury" design system.
 * Unlike FadeInBoth, this animates once and stays visible — it does not
 * re-trigger on repeat scroll passes.
 */
export default function FadeUp({ children, delay = 0, as: Tag = 'div', style = {}, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(noMotion);

  useEffect(() => {
    if (noMotion) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`vn2-fade-up ${visible ? 'vn2-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}
