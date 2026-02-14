import { forwardRef } from "react";

/**
 * Vertically scrolling list of titles rendered inside a masked / clipped viewport.
 * Each title gets an "active" class when closest to the viewport center.
 */
const TitleList = forwardRef(({ projects, activeIndex }, ref) => {
  return (
    <div className="title-viewport">
      <div className="title-list" ref={ref}>
        {projects.map((p, i) => (
          <div
            key={p.id}
            className={`title-item ${i === activeIndex ? "active" : ""}`}
          >
            <h2>{p.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
});

TitleList.displayName = "TitleList";
export default TitleList;
