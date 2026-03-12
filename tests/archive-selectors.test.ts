import { describe, expect, it } from "vitest";

import {
  getCityGroupingSummaries,
  getCountryDetailSummary,
  getWorldMapCountrySummaries,
  type ArchiveVisitEntry,
  type VisitRecord,
} from "@/lib/archive";

function createVisit(
  overrides: Partial<VisitRecord> & Pick<VisitRecord, "id" | "sourceType">,
): VisitRecord {
  return {
    id: overrides.id,
    sourceType: overrides.sourceType,
    countryCode: overrides.countryCode ?? "JP",
    countryName: overrides.countryName ?? "Japan",
    cityName: overrides.cityName ?? null,
    visitedAt: overrides.visitedAt ?? null,
    ...overrides,
  };
}

const archiveEntries: ArchiveVisitEntry[] = [
  {
    visit: createVisit({
      id: "jp-1",
      cityName: "Tokyo",
      sourceType: "photo",
      visitedAt: "2025-04-10T00:00:00.000Z",
    }),
    photoAssetCount: 3,
    travelPostCount: 1,
  },
  {
    visit: createVisit({
      id: "jp-2",
      cityName: "Tokyo",
      sourceType: "text",
      visitedAt: "2025-05-02T00:00:00.000Z",
    }),
    photoAssetCount: 0,
    travelPostCount: 2,
  },
  {
    visit: createVisit({
      id: "jp-3",
      cityName: " ",
      sourceType: "photo",
      visitedAt: "2025-06-14T00:00:00.000Z",
    }),
    photoAssetCount: 1,
    travelPostCount: 0,
  },
  {
    visit: createVisit({
      id: "fr-1",
      countryCode: "FR",
      countryName: "France",
      cityName: "Paris",
      sourceType: "photo",
      visitedAt: "2024-08-20T00:00:00.000Z",
    }),
    photoAssetCount: 2,
    travelPostCount: 1,
  },
];

describe("archive selectors", () => {
  it("builds world map summaries with persisted archive counts", () => {
    expect(getWorldMapCountrySummaries(archiveEntries, { themeName: "red" })).toEqual([
      {
        countryCode: "JP",
        countryName: "Japan",
        visitCount: 3,
        photoVisitCount: 2,
        textVisitCount: 1,
        uniqueCityCount: 1,
        lastVisitedAt: "2025-06-14T00:00:00.000Z",
        photoAssetCount: 4,
        travelPostCount: 3,
        normalizedIntensity: 1,
        themedIntensity: 1,
        intensityBucket: 5,
        fillColor: "#B91C1C",
      },
      {
        countryCode: "FR",
        countryName: "France",
        visitCount: 1,
        photoVisitCount: 1,
        textVisitCount: 0,
        uniqueCityCount: 1,
        lastVisitedAt: "2024-08-20T00:00:00.000Z",
        photoAssetCount: 2,
        travelPostCount: 1,
        normalizedIntensity: 1 / 3,
        themedIntensity: expect.closeTo((1 / 3) ** 0.85, 8),
        intensityBucket: 2,
        fillColor: "#F9B4B4",
      },
    ]);
  });

  it("builds city grouping summaries with relation totals and visit ids", () => {
    expect(getCityGroupingSummaries(archiveEntries, "JP", { themeName: "ocean" })).toEqual([
      {
        countryCode: "JP",
        countryName: "Japan",
        cityName: "Tokyo",
        visitCount: 2,
        photoVisitCount: 1,
        textVisitCount: 1,
        lastVisitedAt: "2025-05-02T00:00:00.000Z",
        photoAssetCount: 3,
        travelPostCount: 3,
        visitIds: ["jp-1", "jp-2"],
        normalizedIntensity: 1,
        themedIntensity: 1,
        intensityBucket: 5,
        fillColor: "#0F4C81",
      },
      {
        countryCode: "JP",
        countryName: "Japan",
        cityName: "Unknown city",
        visitCount: 1,
        photoVisitCount: 1,
        textVisitCount: 0,
        lastVisitedAt: "2025-06-14T00:00:00.000Z",
        photoAssetCount: 1,
        travelPostCount: 0,
        visitIds: ["jp-3"],
        normalizedIntensity: 0.5,
        themedIntensity: expect.closeTo(0.5 ** 1.05, 8),
        intensityBucket: 3,
        fillColor: "#6AB7F5",
      },
    ]);
  });

  it("builds a country detail summary from persisted archive entries", () => {
    expect(getCountryDetailSummary(archiveEntries, "jp", { themeName: "red" })).toEqual({
      countryCode: "JP",
      countryName: "Japan",
      countrySummary: {
        countryCode: "JP",
        countryName: "Japan",
        visitCount: 3,
        photoVisitCount: 2,
        textVisitCount: 1,
        uniqueCityCount: 1,
        lastVisitedAt: "2025-06-14T00:00:00.000Z",
        photoAssetCount: 4,
        travelPostCount: 3,
        normalizedIntensity: 1,
        themedIntensity: 1,
        intensityBucket: 5,
        fillColor: "#B91C1C",
      },
      archiveCounts: {
        totalVisits: 3,
        countriesVisited: 1,
        citiesVisited: 1,
        photoVisits: 2,
        textVisits: 1,
        visitsWithCountry: 3,
        visitsWithCity: 2,
      },
      cityGroups: [
        {
          countryCode: "JP",
          countryName: "Japan",
          cityName: "Tokyo",
          visitCount: 2,
          photoVisitCount: 1,
          textVisitCount: 1,
          lastVisitedAt: "2025-05-02T00:00:00.000Z",
          photoAssetCount: 3,
          travelPostCount: 3,
          visitIds: ["jp-1", "jp-2"],
          normalizedIntensity: 1,
          themedIntensity: 1,
          intensityBucket: 5,
          fillColor: "#B91C1C",
        },
        {
          countryCode: "JP",
          countryName: "Japan",
          cityName: "Unknown city",
          visitCount: 1,
          photoVisitCount: 1,
          textVisitCount: 0,
          lastVisitedAt: "2025-06-14T00:00:00.000Z",
          photoAssetCount: 1,
          travelPostCount: 0,
          visitIds: ["jp-3"],
          normalizedIntensity: 0.5,
          themedIntensity: expect.closeTo(0.5 ** 0.85, 8),
          intensityBucket: 3,
          fillColor: "#F37C7C",
        },
      ],
      photoAssetCount: 4,
      travelPostCount: 3,
    });
  });
});
