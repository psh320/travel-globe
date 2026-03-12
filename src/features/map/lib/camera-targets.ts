import type { Bounds2D, CameraTarget } from "@/features/map/types";

const CAMERA_Z = 36;
const MIN_ZOOM = 1.2;
const MAX_ZOOM = 7.5;

export function expandBounds(bounds: Bounds2D, padding: number): Bounds2D {
  return {
    minX: bounds.minX - padding,
    minY: bounds.minY - padding,
    maxX: bounds.maxX + padding,
    maxY: bounds.maxY + padding,
  };
}

export function mergeBounds(boundsList: Bounds2D[]) {
  return boundsList.reduce<Bounds2D>(
    (mergedBounds, bounds) => ({
      minX: Math.min(mergedBounds.minX, bounds.minX),
      minY: Math.min(mergedBounds.minY, bounds.minY),
      maxX: Math.max(mergedBounds.maxX, bounds.maxX),
      maxY: Math.max(mergedBounds.maxY, bounds.maxY),
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    },
  );
}

export function createCameraTarget(
  bounds: Bounds2D,
  viewport: { width: number; height: number },
  padding = 12,
): CameraTarget {
  const expandedBounds = expandBounds(bounds, padding);
  const width = Math.max(1, expandedBounds.maxX - expandedBounds.minX);
  const height = Math.max(1, expandedBounds.maxY - expandedBounds.minY);
  const zoom = Math.min(
    viewport.width / width,
    viewport.height / height,
  );

  return {
    center: [
      (expandedBounds.minX + expandedBounds.maxX) / 2,
      (expandedBounds.minY + expandedBounds.maxY) / 2,
    ],
    position: [
      (expandedBounds.minX + expandedBounds.maxX) / 2,
      (expandedBounds.minY + expandedBounds.maxY) / 2,
      CAMERA_Z,
    ],
    zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * 0.78)),
  };
}
