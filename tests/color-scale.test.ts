import { describe, expect, it } from "vitest";

import {
  applyThemeIntensity,
  calculateRelativeIntensity,
  getIntensityBucket,
  getTheme,
  getThemeColor,
} from "@/lib/color-scale";

describe("color scale utilities", () => {
  it("normalizes counts relative to the user's own maximum", () => {
    expect(calculateRelativeIntensity(0, 8)).toBe(0);
    expect(calculateRelativeIntensity(2, 8)).toBe(0.25);
    expect(calculateRelativeIntensity(8, 8)).toBe(1);
  });

  it("applies theme-specific intensity curves", () => {
    expect(applyThemeIntensity(0.5, "red")).toBeCloseTo(0.5 ** 0.85, 8);
    expect(applyThemeIntensity(0.5, "ocean")).toBeCloseTo(0.5 ** 1.05, 8);
  });

  it("maps intensity buckets to theme colors", () => {
    expect(getTheme("red").bucketColors).toHaveLength(5);
    expect(getIntensityBucket(0, 5)).toBe(0);
    expect(getIntensityBucket(0.01, 5)).toBe(1);
    expect(getIntensityBucket(1, 5)).toBe(5);
    expect(getThemeColor("red", 0)).toBe("#E5E7EB");
    expect(getThemeColor("red", 5)).toBe("#B91C1C");
  });
});
