import { describe, expect, it } from "vitest";

import {
  createCountryArchiveIndex,
  getMaxVisitCount,
  getRelativeIntensity,
} from "@/lib/color-scale/country-color-scale";

const archiveData = [
  { countryCode: "392", visitCount: 8, photoCount: 40, postCount: 4 },
  { countryCode: "250", visitCount: 2, photoCount: 12, postCount: 1 },
];

describe("archive intensity helpers", () => {
  it("indexes country summaries by country code", () => {
    const archiveIndex = createCountryArchiveIndex(archiveData);

    expect(archiveIndex.get("392")?.photoCount).toBe(40);
    expect(archiveIndex.get("250")?.visitCount).toBe(2);
  });

  it("finds the strongest visit count for scaling", () => {
    expect(getMaxVisitCount(archiveData)).toBe(8);
  });

  it("returns a clamped relative intensity", () => {
    expect(getRelativeIntensity(2, 8)).toBe(0.25);
    expect(getRelativeIntensity(0, 8)).toBe(0);
    expect(getRelativeIntensity(3, 0)).toBe(0);
    expect(getRelativeIntensity(12, 8)).toBe(1);
  });
});
