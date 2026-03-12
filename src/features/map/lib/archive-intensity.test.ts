import { describe, expect, it } from "vitest";

import {
  createArchiveIndex,
  getMaxVisitCount,
  getRelativeIntensity,
} from "@/features/map/lib/archive-intensity";

const archiveData = [
  { countryName: "Japan", visitCount: 8, photoCount: 40, postCount: 4 },
  { countryName: "France", visitCount: 2, photoCount: 12, postCount: 1 },
];

describe("archive intensity helpers", () => {
  it("indexes country summaries by country name", () => {
    const archiveIndex = createArchiveIndex(archiveData);

    expect(archiveIndex.get("Japan")?.photoCount).toBe(40);
    expect(archiveIndex.get("France")?.visitCount).toBe(2);
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
