import { describe, expect, it } from "vitest";

import {
  createArchiveVisitEntriesFromDetails,
  createPersistedArchiveReadModel,
  getPersistedCityGroupingSummaries,
  getPersistedCountryDetailSummary,
  getPersistedWorldMapCountrySummaries,
} from "@/lib/supabase/read-model";
import type { ArchiveVisitDetail } from "@/lib/supabase/types";

describe("persisted archive read model", () => {
  const details: ArchiveVisitDetail[] = [
    {
      visit: {
        id: "visit-1",
        userId: "user-1",
        countryCode: "JP",
        countryName: "Japan",
        cityName: "Tokyo",
        sourceType: "photo",
        confidenceLevel: "high",
        visitedAt: "2025-04-10T00:00:00.000Z",
        createdAt: "2025-04-11T00:00:00.000Z",
        updatedAt: "2025-04-12T00:00:00.000Z",
      },
      visitRow: {
        id: "visit-1",
        user_id: "user-1",
        country_code: "JP",
        country_name: "Japan",
        city_name: "Tokyo",
        latitude: null,
        longitude: null,
        source_type: "photo",
        location_confidence: "high",
        visited_at: "2025-04-10T00:00:00.000Z",
        created_at: "2025-04-11T00:00:00.000Z",
        updated_at: "2025-04-12T00:00:00.000Z",
      },
      photos: [
        {
          id: "asset-1",
          userId: "user-1",
          visitId: "visit-1",
          storageBucket: "travel-photos",
          storagePath: "user-1/visit-1/asset-1/photo.jpg",
          fileName: "photo.jpg",
          mimeType: "image/jpeg",
          fileSizeBytes: 1024,
          capturedAt: "2025-04-10T00:00:00.000Z",
          exifLatitude: null,
          exifLongitude: null,
          inferredCountryCode: "JP",
          inferredCountryName: "Japan",
          inferredCityName: "Tokyo",
          inferredLatitude: null,
          inferredLongitude: null,
          inferredLocationConfidence: "high",
          metadata: {},
          publicUrl: null,
          createdAt: "2025-04-11T00:00:00.000Z",
          updatedAt: "2025-04-12T00:00:00.000Z",
        },
        {
          id: "asset-2",
          userId: "user-1",
          visitId: "visit-1",
          storageBucket: "travel-photos",
          storagePath: "user-1/visit-1/asset-2/photo.jpg",
          fileName: "photo-2.jpg",
          mimeType: "image/jpeg",
          fileSizeBytes: 2048,
          capturedAt: null,
          exifLatitude: null,
          exifLongitude: null,
          inferredCountryCode: "JP",
          inferredCountryName: "Japan",
          inferredCityName: "Tokyo",
          inferredLatitude: null,
          inferredLongitude: null,
          inferredLocationConfidence: "medium",
          metadata: {},
          publicUrl: null,
          createdAt: "2025-04-11T00:00:00.000Z",
          updatedAt: "2025-04-12T00:00:00.000Z",
        },
      ],
      posts: [
        {
          id: "post-1",
          userId: "user-1",
          visitId: "visit-1",
          title: "Tokyo arrival",
          content: "Landed and explored Shibuya.",
          countryCode: "JP",
          cityName: "Tokyo",
          createdAt: "2025-04-10T00:00:00.000Z",
          updatedAt: "2025-04-10T01:00:00.000Z",
        },
      ],
    },
    {
      visit: {
        id: "visit-2",
        userId: "user-1",
        countryCode: "JP",
        countryName: "Japan",
        cityName: null,
        sourceType: "text",
        confidenceLevel: "manual",
        visitedAt: "2025-05-10T00:00:00.000Z",
        createdAt: "2025-05-11T00:00:00.000Z",
        updatedAt: "2025-05-12T00:00:00.000Z",
      },
      visitRow: {
        id: "visit-2",
        user_id: "user-1",
        country_code: "JP",
        country_name: "Japan",
        city_name: null,
        latitude: null,
        longitude: null,
        source_type: "text",
        location_confidence: "manual",
        visited_at: "2025-05-10T00:00:00.000Z",
        created_at: "2025-05-11T00:00:00.000Z",
        updated_at: "2025-05-12T00:00:00.000Z",
      },
      photos: [],
      posts: [
        {
          id: "post-2",
          userId: "user-1",
          visitId: "visit-2",
          title: "Kyoto notes",
          content: "Train rides and temples.",
          countryCode: "JP",
          cityName: null,
          createdAt: "2025-05-10T00:00:00.000Z",
          updatedAt: "2025-05-10T01:00:00.000Z",
        },
      ],
    },
  ];

  it("builds archive entries with persisted photo and post counts", () => {
    expect(createArchiveVisitEntriesFromDetails(details)).toEqual([
      {
        visit: expect.objectContaining({
          id: "visit-1",
          countryCode: "JP",
        }),
        photoAssetCount: 2,
        travelPostCount: 1,
      },
      {
        visit: expect.objectContaining({
          id: "visit-2",
          countryCode: "JP",
        }),
        photoAssetCount: 0,
        travelPostCount: 1,
      },
    ]);
  });

  it("builds persisted world map country summaries through the shared archive selectors", () => {
    expect(getPersistedWorldMapCountrySummaries(details, { themeName: "red" })).toEqual([
      {
        countryCode: "JP",
        countryName: "Japan",
        visitCount: 2,
        photoVisitCount: 1,
        textVisitCount: 1,
        uniqueCityCount: 1,
        lastVisitedAt: "2025-05-10T00:00:00.000Z",
        photoAssetCount: 2,
        travelPostCount: 2,
        normalizedIntensity: 1,
        themedIntensity: 1,
        intensityBucket: 5,
        fillColor: "#B91C1C",
      },
    ]);
  });

  it("builds persisted country detail and city grouping summaries", () => {
    expect(getPersistedCountryDetailSummary(details, "JP", { themeName: "red" })).toEqual({
      countryCode: "JP",
      countryName: "Japan",
      countrySummary: {
        countryCode: "JP",
        countryName: "Japan",
        visitCount: 2,
        photoVisitCount: 1,
        textVisitCount: 1,
        uniqueCityCount: 1,
        lastVisitedAt: "2025-05-10T00:00:00.000Z",
        photoAssetCount: 2,
        travelPostCount: 2,
        normalizedIntensity: 1,
        themedIntensity: 1,
        intensityBucket: 5,
        fillColor: "#B91C1C",
      },
      archiveCounts: {
        totalVisits: 2,
        countriesVisited: 1,
        citiesVisited: 1,
        photoVisits: 1,
        textVisits: 1,
        visitsWithCountry: 2,
        visitsWithCity: 1,
      },
      cityGroups: [
        {
          countryCode: "JP",
          countryName: "Japan",
          cityName: "Tokyo",
          visitCount: 1,
          photoVisitCount: 1,
          textVisitCount: 0,
          lastVisitedAt: "2025-04-10T00:00:00.000Z",
          photoAssetCount: 2,
          travelPostCount: 1,
          visitIds: ["visit-1"],
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
          photoVisitCount: 0,
          textVisitCount: 1,
          lastVisitedAt: "2025-05-10T00:00:00.000Z",
          photoAssetCount: 0,
          travelPostCount: 1,
          visitIds: ["visit-2"],
          normalizedIntensity: 1,
          themedIntensity: 1,
          intensityBucket: 5,
          fillColor: "#B91C1C",
        },
      ],
      photoAssetCount: 2,
      travelPostCount: 2,
    });

    expect(getPersistedCityGroupingSummaries(details, "JP", { themeName: "ocean" })).toEqual([
      {
        countryCode: "JP",
        countryName: "Japan",
        cityName: "Tokyo",
        visitCount: 1,
        photoVisitCount: 1,
        textVisitCount: 0,
        lastVisitedAt: "2025-04-10T00:00:00.000Z",
        photoAssetCount: 2,
        travelPostCount: 1,
        visitIds: ["visit-1"],
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
        photoVisitCount: 0,
        textVisitCount: 1,
        lastVisitedAt: "2025-05-10T00:00:00.000Z",
        photoAssetCount: 0,
        travelPostCount: 1,
        visitIds: ["visit-2"],
        normalizedIntensity: 1,
        themedIntensity: 1,
        intensityBucket: 5,
        fillColor: "#0F4C81",
      },
    ]);
  });

  it("builds the shared persisted archive read model in one step", () => {
    expect(createPersistedArchiveReadModel(details, { themeName: "red" })).toEqual({
      entries: createArchiveVisitEntriesFromDetails(details),
      visits: [
        expect.objectContaining({ id: "visit-1", countryCode: "JP" }),
        expect.objectContaining({ id: "visit-2", countryCode: "JP" }),
      ],
      countrySummaries: getPersistedWorldMapCountrySummaries(details, {
        themeName: "red",
      }),
    });
  });
});
