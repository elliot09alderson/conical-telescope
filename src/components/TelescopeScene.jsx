import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import projects from "../data/projects";
import Background from "./Background";
import TitleList from "./TitleList";
import CurvedThumbnails from "./CurvedThumbnails";
import AngleIndicator from "./AngleIndicator";

gsap.registerPlugin(ScrollTrigger);

/**
 * Main scene component — orchestrates the scroll-driven telescope animation.
 *
 * scrollProgress is stored in a ref (not state) so that CurvedThumbnails
 * can read it every frame without React re-render batching causing stutter.
 */
export default function TelescopeScene({ lenisRef }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const titleListRef = useRef(null);
  const spacerRef = useRef(null);
  const progressRef = useRef(0);

  const updateActiveState = useCallback((progress) => {
    progressRef.current = progress;

    const count = projects.length;
    const raw = progress * (count - 1);
    const idx = Math.round(raw);
    const clamped = Math.max(0, Math.min(count - 1, idx));
    setActiveIndex(clamped);
  }, []);

  useEffect(() => {
    const onScroll = () => ScrollTrigger.update();
    lenisRef?.current?.on("scroll", onScroll);

    const tickerCallback = (time) => {
      lenisRef?.current?.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const trigger = ScrollTrigger.create({
      trigger: spacerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        updateActiveState(self.progress);
      },
    });

    return () => {
      trigger.kill();
      gsap.ticker.remove(tickerCallback);
    };
  }, [lenisRef, updateActiveState]);

  // Keep the active title centred in the viewport
  useEffect(() => {
    if (!titleListRef.current) return;
    const items = titleListRef.current.querySelectorAll(".title-item");
    if (!items[activeIndex]) return;

    const listRect = titleListRef.current.getBoundingClientRect();
    const itemRect = items[activeIndex].getBoundingClientRect();
    const listCenter = listRect.height / 2;
    const itemCenter = itemRect.top - listRect.top + itemRect.height / 2;
    const offset = listCenter - itemCenter;

    gsap.to(titleListRef.current, {
      y: offset,
      duration: 0.6,
      ease: "power3.out",
    });
  }, [activeIndex]);

  return (
    <>
      <div className="scene-fixed">
        <Background activeIndex={activeIndex} projects={projects} />

        {/* Left side label */}
        <div className="discover-label">
          <span>Discover</span>
        </div>

        {/* Angle indicator — two lines forming a ">" that tracks the active title */}
        <AngleIndicator />

        <TitleList
          ref={titleListRef}
          projects={projects}
          activeIndex={activeIndex}
        />

        <CurvedThumbnails
          projects={projects}
          progressRef={progressRef}
        />
      </div>

      {/* Spacer — 50vh per project for quicker scroll switching */}
      <div
        ref={spacerRef}
        className="scroll-spacer"
        style={{ height: `${projects.length * 50}vh` }}
      />
    </>
  );
}
