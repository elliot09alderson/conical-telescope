/**
 * Quadratic Bezier curve utilities.
 *
 * B(t) = (1-t)^2 * P0  +  2(1-t)t * P1  +  t^2 * P2
 *
 * P0 = start,  P1 = control,  P2 = end,  t ∈ [0, 1]
 */

/** Evaluate a single component (x or y) along the curve at parameter t. */
export function quadBezier(t, p0, p1, p2) {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

/**
 * Return {x, y} on the curve for a given t.
 * Each point is an object {x, y}.
 */
export function pointOnCurve(t, start, control, end) {
  return {
    x: quadBezier(t, start.x, control.x, end.x),
    y: quadBezier(t, start.y, control.y, end.y),
  };
}
