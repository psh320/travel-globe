import { describe, expect, it } from "vitest";

import { createCameraTarget, expandBounds, mergeBounds } from "@/features/map/lib/camera-targets";

describe("camera target helpers", () => {
  it("expands bounds symmetrically", () => {
    expect(
      expandBounds(
        {
          minX: -10,
          minY: -5,
          maxX: 10,
          maxY: 5,
        },
        3,
      ),
    ).toEqual({
      minX: -13,
      minY: -8,
      maxX: 13,
      maxY: 8,
    });
  });

  it("merges multiple country bounds into one world bounds object", () => {
    expect(
      mergeBounds([
        { minX: -40, minY: -20, maxX: -12, maxY: 4 },
        { minX: 10, minY: -6, maxX: 32, maxY: 24 },
      ]),
    ).toEqual({
      minX: -40,
      minY: -20,
      maxX: 32,
      maxY: 24,
    });
  });

  it("zooms further in for a smaller selected country", () => {
    const worldTarget = createCameraTarget(
      { minX: -150, minY: -80, maxX: 150, maxY: 80 },
      { width: 1200, height: 800 },
      20,
    );
    const countryTarget = createCameraTarget(
      { minX: -20, minY: -14, maxX: 20, maxY: 14 },
      { width: 1200, height: 800 },
      16,
    );

    expect(countryTarget.zoom).toBeGreaterThan(worldTarget.zoom);
    expect(countryTarget.center).toEqual([0, 0]);
  });
});
