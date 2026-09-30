import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Numbered horizontal scroll-snap carousel: "01 / 08" counter, arrow
 * buttons, drag/touch/keyboard support. Active card renders at full
 * opacity, neighbors are dimmed — dimming itself is left to renderItem
 * via the `active` flag it receives.
 */
export default function Carousel({ items, renderItem, ariaLabel = 'Carousel', gap = 24, cardWidth }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const dragState = useRef({ dragging: false, startX: 0, startScroll: 0, moved: false });

  // With scroll-snap-align: center, the first and last cards can never
  // actually reach the centered/"active" position on their own -- there's
  // no room left to scroll past their own edge. Spacer elements at both
  // ends of the track (sized to roughly half the viewport minus half a
  // card) give the browser room to center them too.
  const hasSpacers = Boolean(cardWidth);
  const indexOffset = hasSpacers ? 1 : 0;
  const spacerStyle = hasSpacers
    ? { flex: '0 0 auto', width: `calc(50% - (${cardWidth}) / 2)` }
    : null;

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    const child = track.children[clamped + indexOffset];
    if (child) {
      track.scrollTo({
        left: child.offsetLeft - (track.offsetWidth - child.offsetWidth) / 2,
        behavior: 'smooth',
      });
    }
  }, [items.length, indexOffset]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const center = track.scrollLeft + track.offsetWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      Array.from(track.children).forEach((child, i) => {
        if (child.dataset.spacer) return;
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const dist = Math.abs(childCenter - center);
        if (dist < closestDist) { closestDist = dist; closest = i - indexOffset; }
      });
      setActive(closest);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener('scroll', onScroll);
  }, [indexOffset]);

  const onPointerDown = (e) => {
    if (e.pointerType === 'touch') return; // native touch panning handles this
    const track = trackRef.current;
    dragState.current = { dragging: true, startX: e.clientX, startScroll: track.scrollLeft, moved: false };
    track.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragState.current.dragging) return;
    const track = trackRef.current;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 3) dragState.current.moved = true;
    track.scrollLeft = dragState.current.startScroll - dx;
  };
  const endDrag = (e) => {
    dragState.current.dragging = false;
    try { trackRef.current.releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollToIndex(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToIndex(active - 1); }
  };

  const pad = (n) => String(n + 1).padStart(2, '0');

  return (
    <div role="region" aria-roledescription="carousel" aria-label={ariaLabel}>
      <div
        ref={trackRef}
        className="vn2-carousel-track"
        tabIndex={0}
        role="group"
        aria-label={`${ariaLabel} slides`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(e) => { if (dragState.current.moved) { e.preventDefault(); e.stopPropagation(); } }}
        style={{
          display: 'flex',
          gap,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
          cursor: 'grab',
          paddingBottom: 4,
        }}
      >
        {hasSpacers && <div aria-hidden="true" data-spacer="true" style={spacerStyle} />}
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            style={{
              scrollSnapAlign: 'center',
              flex: '0 0 auto',
              opacity: i === active ? 1 : 0.5,
              transition: 'opacity 400ms var(--ease-cinematic)',
            }}
          >
            {renderItem(item, i, i === active)}
          </div>
        ))}
        {hasSpacers && <div aria-hidden="true" data-spacer="true" style={spacerStyle} />}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: '0.08em', color: 'var(--vn-text-sub)' }}>
          {pad(active)} / {pad(items.length - 1)}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            aria-label={`Previous ${ariaLabel} item`}
            onClick={() => scrollToIndex(active - 1)}
            disabled={active === 0}
            className="vn2-btn vn2-btn-outline"
            style={{ padding: '10px 18px', opacity: active === 0 ? 0.35 : 1, cursor: active === 0 ? 'default' : 'pointer' }}
          >
            &larr;
          </button>
          <button
            type="button"
            aria-label={`Next ${ariaLabel} item`}
            onClick={() => scrollToIndex(active + 1)}
            disabled={active === items.length - 1}
            className="vn2-btn vn2-btn-outline"
            style={{ padding: '10px 18px', opacity: active === items.length - 1 ? 0.35 : 1, cursor: active === items.length - 1 ? 'default' : 'pointer' }}
          >
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
