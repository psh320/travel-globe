import { describe, expect, it } from "vitest";

import type { ArchiveVisitEntry } from "@/lib/archive";
import type { ArchiveVisitDetail } from "@/lib/supabase";

import {
  buildCountryArchivePanelData,
  buildWorldArchivePanelData,
} from "./archive-panel-data";

const entries: ArchiveVisitEntry[] = [
  {
    visit: {
      id: "visit-jp-1",
      countryCode: "JP",
      countryName: "Japan",
      cityName: "Tokyo",
      sourceType: "photo",
      confidenceLevel: "high",
      visitedAt: "2025-04-10T00:00:00.000Z",
    },
    photoAssetCount: 2,
    travelPostCount: 1,
  },
  {
    visit: {
      id: "visit-jp-2",
      countryCode: "JP",
      countryName: "Japan",
      cityName: null,
      sourceType: "text",
      confidenceLevel: "manual",
      visitedAt: "2025-05-10T00:00:00.000Z",
    },
    photoAssetCount: 0,
    travelPostCount: 1,
  },
  {
    visit: {
      id: "visit-fr-1",
      countryCode: "FR",
      countryName: "France",
      cityName: "Paris",
      sourceType: "photo",
      confidenceLevel: "medium",
      visitedAt: "2024-08-20T00:00:00.000Z",
    },
    photoAssetCount: 3,
    travelPostCount: 0,
  },
];

const visitDetails: ArchiveVisitDetail[] = [
  {
    visit: entries[0].visit,
    visitRow: {
      id: "visit-jp-1",
      user_id: "user-1",
      country_code: "JP",
      country_name: "Japan",
      city_name: "Tokyo",
      latitude: null,
      longitude: null,
      source_type: "photo",
      location_confidence: "high",
      visited_at: "2025-04-10T00:00:00.000Z",
      created_at: "2025-04-10T00:00:00.000Z",
      updated_at: "2025-04-10T00:00:00.000Z",
    },
    photos: [],
    posts: [
      {
        id: "post-1",
        userId: "user-1",
        visitId: "visit-jp-1",
        title: "Tokyo arrival",
        content: "Landed and explored Shibuya.",
        countryCode: "JP",
        cityName: "Tokyo",
        createdAt: "2025-04-10T00:00:00.000Z",
        updatedAt: "2025-04-10T00:00:00.000Z",
      },
    ],
  },
];

describe("archive panel data", () => {
  it("builds world archive cards from shared summaries and visit entries", () => {
    const result = buildWorldArchivePanelData(
      [
        {
          countryCode: "JP",
          countryName: "Japan",
          visitCount: 2,
          photoVisitCount: 1,
          textVisitCount: 1,
          uniqueCityCount: 1,
          lastVisitedAt: "2025-05-10T00:00:00.000Z",
          normalizedIntensity: 1,
          themedIntensity: 1,
          intensityBucket: 5,
          fillColor: "#B91C1C",
          photoAssetCount: 2,
          travelPostCount: 2,
        },
      ],
      entries,
      visitDetails,
    );

    expect(result.summaryCards[0]).toEqual(
      expect.objectContaining({
        title: "Japan",
        subtitle: "JP • 2 entries",
      }),
    );
    expect(result.memoryCards[0]).toEqual(
      expect.objectContaining({
        id: "visit-jp-2",
        title: "Japan",
      }),
    );
  });

  it("builds country panel cards with city groups and visit memory cards", () => {
    const result = buildCountryArchivePanelData(entries, visitDetails, "JP");

    expect(result.summary?.countryCode).toBe("JP");
    expect(result.stats).toEqual([
      { label: "Entries", value: "2" },
      { label: "Cities", value: "1" },
      { label: "Photos", value: "2" },
      { label: "Posts", value: "2" },
    ]);
    expect(result.cityCards[0]).toEqual(
      expect.objectContaining({
        title: "Tokyo",
      }),
    );
    expect(result.memoryCards[1]).toEqual(
      expect.objectContaining({
        id: "visit-jp-1",
        supportingText: "Tokyo arrival",
      }),
    );
  });
});
