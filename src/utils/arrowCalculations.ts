interface Point {
  x: number;
  y: number;
}

export const calculateIntersectionPoint = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  elementWidth: number,
  elementHeight: number
): Point => {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const angle = Math.atan2(dy, dx);

  // Adjust these values to account for the element's actual dimensions
  const halfWidth = elementWidth / 2;
  const halfHeight = elementHeight / 2;

  // Calculate intersection with element border
  const slope = Math.abs(dy / dx);
  const elementSlope = halfHeight / halfWidth;

  let x, y;
  if (slope <= elementSlope) {
    // Intersects with left/right border
    x = dx > 0 ? -halfWidth : halfWidth;
    y = slope * x;
  } else {
    // Intersects with top/bottom border
    y = dy > 0 ? -halfHeight : halfHeight;
    x = y / slope;
  }

  // Add offset to ensure arrows start/end exactly at the border
  const offset = 2;
  if (dx > 0) x -= offset;
  else x += offset;
  if (dy > 0) y -= offset;
  else y += offset;

  return {
    x: targetX + x,
    y: targetY + y
  };
};