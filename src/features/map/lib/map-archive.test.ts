import { describe, expect, it } from "vitest";

import { createMapArchiveIndex, resolveMapCountrySummaries } from "@/features/map/lib/map-archive";
import type { CountryMapSummary, VisitRecord } from "@/lib/archive";

const providedSummary: CountryMapSummary = {
  countryCode: "JP",
  countryName: "Japan",
  fillColor: "#123456",
  intensityBucket: 2,
  lastVisitedAt: "2024-10-10",
  normalizedIntensity: 1,
  photoVisitCount: 1,
  textVisitCount: 0,
  themedIntensity: 1,
  uniqueCityCount: 1,
  visitCount: 1,
};

const visitRecord: VisitRecord = {
  id: "visit-fr-1",
  countryCode: "FR",
  countryName: "France",
  cityName: "Paris",
  sourceType: "photo",
  visitedAt: "2024-09-01",
};

describe("resolveMapCountrySummaries", () => {
  it("prefers provided shared summaries", () => {
    expect(
      resolveMapCountrySummaries({
        countrySummaries: [providedSummary],
        visits: [visitRecord],
        themeName: "red",
      }),
    ).toEqual([providedSummary]);
  });

  it("treats an explicitly empty summary list as persisted state", () => {
    expect(
      resolveMapCountrySummaries({
        countrySummaries: [],
        visits: [visitRecord],
        themeName: "red",
      }),
    ).toEqual([]);
  });

  it("derives summaries from visits when shared summaries are absent", () => {
    expect(
      resolveMapCountrySummaries({
        visits: [visitRecord],
        themeName: "red",
      }),
    ).toMatchObject([
      {
        countryCode: "FR",
        countryName: "France",
        visitCount: 1,
      },
    ]);
  });
});

describe("createMapArchiveIndex", () => {
  it("indexes summaries by country code", () => {
    const archiveIndex = createMapArchiveIndex([providedSummary]);

    expect(archiveIndex.get("JP")).toEqual(providedSummary);
    expect(archiveIndex.get("FR")).toBeUndefined();
  });
});
