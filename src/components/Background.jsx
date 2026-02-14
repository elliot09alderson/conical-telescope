import { useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * Full-screen fixed background that crossfades between project images.
 * Receives `activeIndex` and the projects data array.
 */
export default function Background({ activeIndex, projects }) {
  const prevIndex = useRef(activeIndex);
  const containerRef = useRef(null);

  useEffect(() => {
    if (prevIndex.current === activeIndex) return;

    const layers = containerRef.current.querySelectorAll(".bg-layer");

    // Fade out all layers, then fade in the active one
    gsap.to(layers, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });

    gsap.to(layers[activeIndex], {
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
    });

    prevIndex.current = activeIndex;
  }, [activeIndex]);

  return (
    <div ref={containerRef} className="background-container">
      {projects.map((p, i) => (
        <div
          key={p.id}
          className="bg-layer"
          style={{
            backgroundImage: `url(${p.bg})`,
            backgroundColor: p.color,
            opacity: i === 0 ? 1 : 0,
          }}
        />
      ))}
      {/* Dark overlay for text readability */}
      <div className="bg-overlay" />
    </div>
  );
}
