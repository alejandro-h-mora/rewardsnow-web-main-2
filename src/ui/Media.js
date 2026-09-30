import { useState } from 'react';

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #3A2A1E 0%, #171514 60%)',
  'linear-gradient(135deg, #2E241C 0%, #0E0D0C 65%)',
  'linear-gradient(135deg, #33241B 0%, #201D1B 60%)',
];

function gradientFor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return FALLBACK_GRADIENTS[hash % FALLBACK_GRADIENTS.length];
}

/**
 * <img> with a warm golden-hour gradient fallback when the named file
 * under /public/images hasn't been added yet. See README for the full
 * list of placeholders this site expects.
 */
export default function Media({ src, alt, style = {}, imgStyle = {}, imgClassName = '', width, height, loading = 'lazy' }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={imgClassName}
        style={{
          width: width || '100%',
          height: height || '100%',
          background: gradientFor(src),
          ...style,
        }}
      />
    );
  }

  return (
    <div style={{ width: width || '100%', height: height || '100%', overflow: 'hidden', ...style }}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={imgClassName}
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...imgStyle }}
      />
    </div>
  );
}
