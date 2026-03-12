import { describe, expect, it } from "vitest";

import {
  getArchiveCounts,
  getCityMapSummaries,
  getCitySummaries,
  getCountryMapSummaries,
  getCountrySummaries,
  UNKNOWN_CITY_LABEL,
  type VisitRecord,
} from "@/lib/archive";

const visits: VisitRecord[] = [
  {
    id: "1",
    countryCode: "jp",
    countryName: "Japan",
    cityName: "Tokyo",
    sourceType: "photo",
    visitedAt: "2024-04-10T00:00:00.000Z",
  },
  {
    id: "2",
    countryCode: "JP",
    countryName: "Japan",
    cityName: "Tokyo",
    sourceType: "text",
    visitedAt: "2024-06-15T00:00:00.000Z",
  },
  {
    id: "3",
    countryCode: "JP",
    countryName: "Japan",
    cityName: "Kyoto",
    sourceType: "photo",
    visitedAt: "2024-05-01T00:00:00.000Z",
  },
  {
    id: "4",
    countryCode: "FR",
    countryName: "France",
    cityName: "Paris",
    sourceType: "photo",
    visitedAt: "2023-07-20T00:00:00.000Z",
  },
  {
    id: "5",
    countryCode: "FR",
    countryName: "France",
    cityName: " ",
    sourceType: "text",
    visitedAt: "2023-07-21T00:00:00.000Z",
  },
  {
    id: "6",
    countryCode: null,
    countryName: null,
    cityName: "Unknown",
    sourceType: "text",
    visitedAt: "2023-01-01T00:00:00.000Z",
  },
];

describe("archive summaries", () => {
  it("derives archive-level counts from visit data", () => {
    expect(getArchiveCounts(visits)).toEqual({
      totalVisits: 6,
      countriesVisited: 2,
      citiesVisited: 3,
      photoVisits: 3,
      textVisits: 3,
      visitsWithCountry: 5,
      visitsWithCity: 4,
    });
  });

  it("groups country summaries and sorts by visit count", () => {
    expect(getCountrySummaries(visits)).toEqual([
      {
        countryCode: "JP",
        countryName: "Japan",
        visitCount: 3,
        photoVisitCount: 2,
        textVisitCount: 1,
        uniqueCityCount: 2,
        lastVisitedAt: "2024-06-15T00:00:00.000Z",
      },
      {
        countryCode: "FR",
        countryName: "France",
        visitCount: 2,
        photoVisitCount: 1,
        textVisitCount: 1,
        uniqueCityCount: 1,
        lastVisitedAt: "2023-07-21T00:00:00.000Z",
      },
    ]);
  });

  it("groups city summaries and preserves an unknown city bucket", () => {
    expect(getCitySummaries(visits, "fr")).toEqual([
      {
        countryCode: "FR",
        countryName: "France",
        cityName: "Paris",
        visitCount: 1,
        photoVisitCount: 1,
        textVisitCount: 0,
        lastVisitedAt: "2023-07-20T00:00:00.000Z",
      },
      {
        countryCode: "FR",
        countryName: "France",
        cityName: UNKNOWN_CITY_LABEL,
        visitCount: 1,
        photoVisitCount: 0,
        textVisitCount: 1,
        lastVisitedAt: "2023-07-21T00:00:00.000Z",
      },
    ]);
  });
});

describe("map adapters", () => {
  it("returns theme-aware map summaries for countries", () => {
    expect(getCountryMapSummaries(visits, { themeName: "red" })).toEqual([
      {
        countryCode: "JP",
        countryName: "Japan",
        visitCount: 3,
        photoVisitCount: 2,
        textVisitCount: 1,
        uniqueCityCount: 2,
        lastVisitedAt: "2024-06-15T00:00:00.000Z",
        normalizedIntensity: 1,
        themedIntensity: 1,
        intensityBucket: 5,
        fillColor: "#B91C1C",
      },
      {
        countryCode: "FR",
        countryName: "France",
        visitCount: 2,
        photoVisitCount: 1,
        textVisitCount: 1,
        uniqueCityCount: 1,
        lastVisitedAt: "2023-07-21T00:00:00.000Z",
        normalizedIntensity: 2 / 3,
        themedIntensity: expect.closeTo((2 / 3) ** 0.85, 8),
        intensityBucket: 4,
        fillColor: "#E04848",
      },
    ]);
  });

  it("returns city map summaries relative to the selected country", () => {
    expect(getCityMapSummaries(visits, "JP", { themeName: "ocean" })).toEqual([
      {
        countryCode: "JP",
        countryName: "Japan",
        cityName: "Tokyo",
        visitCount: 2,
        photoVisitCount: 1,
        textVisitCount: 1,
        lastVisitedAt: "2024-06-15T00:00:00.000Z",
        normalizedIntensity: 1,
        themedIntensity: 1,
        intensityBucket: 5,
        fillColor: "#0F4C81",
      },
      {
        countryCode: "JP",
        countryName: "Japan",
        cityName: "Kyoto",
        visitCount: 1,
        photoVisitCount: 1,
        textVisitCount: 0,
        lastVisitedAt: "2024-05-01T00:00:00.000Z",
        normalizedIntensity: 0.5,
        themedIntensity: expect.closeTo(0.5 ** 1.05, 8),
        intensityBucket: 3,
        fillColor: "#6AB7F5",
      },
    ]);
  });
});
