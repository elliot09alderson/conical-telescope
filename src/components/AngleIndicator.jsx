/**
 * Two fixed diagonal lines forming a ">" chevron/angle.
 * The vertex sits on the left side near the "Discover" label.
 * Top line fans to upper-right, bottom line fans to lower-center.
 * Purely decorative — does not move.
 */
export default function AngleIndicator() {
  return (
    <svg
      className="angle-indicator"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line
        x1="8%"
        y1="50%"
        x2="42%"
        y2="-5%"
        stroke="#ffffff"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1="8%"
        y1="50%"
        x2="42%"
        y2="105%"
        stroke="#ffffff"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
