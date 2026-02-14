import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Custom hook — initialises Lenis smooth scrolling.
 * Does NOT start its own RAF loop; instead, the caller (TelescopeScene)
 * drives Lenis through GSAP's ticker to keep a single animation loop.
 */
export default function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
