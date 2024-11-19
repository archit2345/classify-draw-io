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
  // Calculate center points
  const centerX = targetX;
  const centerY = targetY;

  // Calculate angle between points
  const angle = Math.atan2(sourceY - centerY, sourceX - centerX);

  // Calculate the point where the line intersects the rectangle
  const halfWidth = elementWidth / 2;
  const halfHeight = elementHeight / 2;

  let intersectionX;
  let intersectionY;

  // Check vertical edges first
  const verticalIntersectY = Math.tan(angle) * halfWidth;
  if (Math.abs(verticalIntersectY) <= halfHeight) {
    // Intersects with vertical edge
    intersectionX = Math.sign(sourceX - centerX) * halfWidth;
    intersectionY = verticalIntersectY;
  } else {
    // Intersects with horizontal edge
    intersectionX = (halfHeight / Math.abs(Math.tan(angle))) * Math.sign(sourceX - centerX);
    intersectionY = Math.sign(sourceY - centerY) * halfHeight;
  }

  // Add small offset to prevent overlap
  const offset = 2;
  intersectionX += Math.sign(sourceX - centerX) * offset;
  intersectionY += Math.sign(sourceY - centerY) * offset;

  return {
    x: centerX + intersectionX,
    y: centerY + intersectionY
  };
};