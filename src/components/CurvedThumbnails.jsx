import { useRef, useEffect, useCallback } from "react";
import { pointOnCurve } from "../utils/bezier";

/**
 * Thumbnails stacked vertically along the right edge of the viewport,
 * following a subtle inward Bezier curve. They flow smoothly as the
 * user scrolls — the one aligned with the active title is largest/brightest.
 *
 * Curve shape (right-edge arc):
 *   P0 — top-right, slightly inward
 *   P1 — mid-right, pulled further inward (creates the arc)
 *   P2 — bottom-right, slightly inward
 *
 * Uses a ref-based RAF loop for frame-perfect smoothness.
 */
export default function CurvedThumbnails({ projects, progressRef }) {
  const thumbRefs = useRef([]);
  const rafId = useRef(null);

  /** Responsive Bezier control points hugging the right edge. */
  const getCurvePoints = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    return {
      start: { x: vw * 0.76, y: vh * -0.05 },
      control: { x: vw * 0.99, y: vh * 0.5 },
      end: { x: vw * 0.76, y: vh * 1.05 },
    };
  }, []);

  useEffect(() => {
    const count = projects.length;
    // Spacing between thumbnails on the t-axis (visible slots on the curve)
    const spacing = 0.30;

    function animate() {
      const { start, control, end } = getCurvePoints();
      const progress = progressRef.current;

      thumbRefs.current.forEach((el, i) => {
        if (!el) return;

        // Distribute thumbnails evenly, centered on t=0.5
        const center = (count - 1) / 2;
        const baseT = 0.5 + (i - center) * spacing;

        // Scroll shifts all thumbnails together along the curve
        const scrollShift = (progress - 0.5) * count * spacing;
        let t = baseT + scrollShift;

        // Wrap around so thumbnails cycle continuously
        const totalRange = count * spacing + 0.5;
        const lo = 0.5 - totalRange / 2;
        t = ((t - lo) % totalRange + totalRange) % totalRange + lo;

        // Hide thumbnails outside visible range
        if (t < -0.05 || t > 1.05) {
          el.style.opacity = "0";
          return;
        }

        const tClamped = Math.max(0, Math.min(1, t));
        const { x, y } = pointOnCurve(tClamped, start, control, end);

        // Distance from center (0 at center, 1 at edges)
        const distFromCenter = Math.abs(tClamped - 0.5) * 2;

        // Scale: largest at center, smaller toward edges
        const scale = 0.55 + (1 - distFromCenter) * 0.45;
        // Opacity: full at center, faded at edges
        const opacity = Math.max(0, 1 - distFromCenter * 0.8);

        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = opacity;
      });

      rafId.current = requestAnimationFrame(animate);
    }

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [projects, progressRef, getCurvePoints]);

  return (
    <div className="thumbnails-container">
      {projects.map((p, i) => (
        <div
          key={p.id}
          className="thumbnail"
          ref={(el) => (thumbRefs.current[i] = el)}
        >
          <img src={p.image} alt={p.title} loading="lazy" draggable={false} />
        </div>
      ))}
    </div>
  );
}
