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
  // Calculate the angle between the points
  const dx = sourceX - targetX;
  const dy = sourceY - targetY;
  const angle = Math.atan2(dy, dx);

  // Calculate the point where the line intersects the rectangle
  const halfWidth = elementWidth / 2;
  const halfHeight = elementHeight / 2;

  // Calculate intersection points for both vertical and horizontal edges
  let intersectionX, intersectionY;

  // Check if intersection is more likely on vertical or horizontal edges
  const absSlope = Math.abs(Math.tan(angle));
  const aspectRatio = halfHeight / halfWidth;

  if (absSlope < aspectRatio) {
    // Intersects with vertical edge
    intersectionX = Math.sign(dx) * halfWidth;
    intersectionY = dy * (intersectionX / dx);
  } else {
    // Intersects with horizontal edge
    intersectionY = Math.sign(dy) * halfHeight;
    intersectionX = dx * (intersectionY / dy);
  }

  // Add a slightly larger offset to ensure no overlap
  const offset = 4;
  const normalizedDx = dx === 0 ? 0 : Math.sign(dx);
  const normalizedDy = dy === 0 ? 0 : Math.sign(dy);
  
  return {
    x: targetX + intersectionX + (normalizedDx * offset),
    y: targetY + intersectionY + (normalizedDy * offset)
  };
};