import { describe, expect, it } from "vitest";

import {
  toArchiveVisitEntries,
  toArchiveVisitEntry,
  type ArchiveVisitDetail,
} from "@/lib/supabase/types";

const visitDetail: ArchiveVisitDetail = {
  visit: {
    id: "visit-1",
    userId: "user-1",
    countryCode: "jp",
    countryName: "Japan",
    cityName: "Tokyo",
    latitude: 35.6764,
    longitude: 139.65,
    sourceType: "photo",
    confidenceLevel: "high",
    visitedAt: "2025-04-10T00:00:00.000Z",
    createdAt: "2025-04-11T00:00:00.000Z",
    updatedAt: "2025-04-11T00:00:00.000Z",
  },
  visitRow: {
    id: "visit-1",
    user_id: "user-1",
    country_code: "JP",
    country_name: "Japan",
    city_name: "Tokyo",
    latitude: 35.6764,
    longitude: 139.65,
    source_type: "photo",
    location_confidence: "high",
    visited_at: "2025-04-10T00:00:00.000Z",
    created_at: "2025-04-11T00:00:00.000Z",
    updated_at: "2025-04-11T00:00:00.000Z",
  },
  photos: [
    {
      id: "asset-1",
      userId: "user-1",
      visitId: "visit-1",
      storageBucket: "travel-photos",
      storagePath: "user-1/visit-1/asset-1/tokyo.jpg",
      fileName: "tokyo.jpg",
      mimeType: "image/jpeg",
      fileSizeBytes: 1234,
      capturedAt: "2025-04-10T00:00:00.000Z",
      exifLatitude: 35.6764,
      exifLongitude: 139.65,
      inferredCountryCode: "JP",
      inferredCountryName: "Japan",
      inferredCityName: "Tokyo",
      inferredLatitude: 35.6764,
      inferredLongitude: 139.65,
      inferredLocationConfidence: "high",
      metadata: {},
      publicUrl: "https://example.test/tokyo.jpg",
      createdAt: "2025-04-11T00:00:00.000Z",
      updatedAt: "2025-04-11T00:00:00.000Z",
    },
    {
      id: "asset-2",
      userId: "user-1",
      visitId: "visit-1",
      storageBucket: "travel-photos",
      storagePath: "user-1/visit-1/asset-2/tokyo-night.jpg",
      fileName: "tokyo-night.jpg",
      mimeType: "image/jpeg",
      fileSizeBytes: 2234,
      capturedAt: "2025-04-10T01:00:00.000Z",
      exifLatitude: 35.6764,
      exifLongitude: 139.65,
      inferredCountryCode: "JP",
      inferredCountryName: "Japan",
      inferredCityName: "Tokyo",
      inferredLatitude: 35.6764,
      inferredLongitude: 139.65,
      inferredLocationConfidence: "high",
      metadata: {},
      publicUrl: "https://example.test/tokyo-night.jpg",
      createdAt: "2025-04-11T00:00:00.000Z",
      updatedAt: "2025-04-11T00:00:00.000Z",
    },
  ],
  posts: [
    {
      id: "post-1",
      userId: "user-1",
      visitId: "visit-1",
      title: "Tokyo notes",
      content: "Bright lights and ramen.",
      countryCode: "JP",
      cityName: "Tokyo",
      createdAt: "2025-04-11T00:00:00.000Z",
      updatedAt: "2025-04-11T00:00:00.000Z",
    },
  ],
};

describe("supabase archive adapters", () => {
  it("converts a persisted visit detail into a shared archive entry", () => {
    expect(toArchiveVisitEntry(visitDetail)).toEqual({
      visit: {
        id: "visit-1",
        userId: "user-1",
        countryCode: "JP",
        countryName: "Japan",
        cityName: "Tokyo",
        latitude: 35.6764,
        longitude: 139.65,
        sourceType: "photo",
        confidenceLevel: "high",
        visitedAt: "2025-04-10T00:00:00.000Z",
        createdAt: "2025-04-11T00:00:00.000Z",
        updatedAt: "2025-04-11T00:00:00.000Z",
      },
      photoAssetCount: 2,
      travelPostCount: 1,
    });
  });

  it("converts lists of persisted visit details into shared archive entries", () => {
    expect(toArchiveVisitEntries([visitDetail])).toEqual([toArchiveVisitEntry(visitDetail)]);
  });
});
