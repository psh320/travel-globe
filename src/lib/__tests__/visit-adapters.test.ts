import { describe, expect, it } from "vitest";

import {
  toArchivePhotoAsset,
  toArchiveTravelPost,
  toArchiveVisitRecord,
} from "@/lib/supabase/types";
import type {
  PersistedPhotoAssetRow,
  PersistedTravelPostRecord,
  PersistedVisitRecord,
} from "@/lib/supabase/types";

describe("supabase adapters", () => {
  it("maps persisted visits into the shared archive visit shape", () => {
    const visit: PersistedVisitRecord = {
      id: "visit-1",
      user_id: "user-1",
      country_code: "jp",
      country_name: "Japan",
      city_name: "Tokyo",
      latitude: 35.6764,
      longitude: 139.65,
      source_type: "photo",
      location_confidence: "high",
      visited_at: "2025-04-10T00:00:00.000Z",
      created_at: "2025-04-11T00:00:00.000Z",
      updated_at: "2025-04-12T00:00:00.000Z",
    };

    expect(toArchiveVisitRecord(visit)).toEqual({
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
      updatedAt: "2025-04-12T00:00:00.000Z",
    });
  });

  it("maps persisted photo assets into UI-safe archive photo assets", async () => {
    const asset: PersistedPhotoAssetRow = {
      id: "asset-1",
      user_id: "user-1",
      visit_id: "visit-1",
      storage_bucket: "travel-photos",
      storage_path: "user-1/visit-1/asset-1/photo.jpg",
      file_name: "photo.jpg",
      mime_type: "image/jpeg",
      file_size_bytes: 2048,
      captured_at: "2025-04-10T00:00:00.000Z",
      exif_latitude: 35.6764,
      exif_longitude: 139.65,
      inferred_country_code: "JP",
      inferred_country_name: "Japan",
      inferred_city_name: "Tokyo",
      inferred_latitude: 35.6764,
      inferred_longitude: 139.65,
      inferred_location_confidence: "high",
      metadata: { device: "camera" },
      created_at: "2025-04-11T00:00:00.000Z",
      updated_at: "2025-04-12T00:00:00.000Z",
    };

    await expect(
      toArchivePhotoAsset(asset, (row) => `https://example.test/${row.storage_path}`),
    ).resolves.toEqual(
      expect.objectContaining({
        id: "asset-1",
        userId: "user-1",
        visitId: "visit-1",
        publicUrl: "https://example.test/user-1/visit-1/asset-1/photo.jpg",
        inferredLocationConfidence: "high",
      }),
    );
  });

  it("maps persisted travel posts into app-facing records", () => {
    const post: PersistedTravelPostRecord = {
      id: "post-1",
      user_id: "user-1",
      visit_id: "visit-1",
      title: "Tokyo arrival",
      content: "Landed and explored Shibuya.",
      country_code: "JP",
      city_name: "Tokyo",
      created_at: "2025-04-10T00:00:00.000Z",
      updated_at: "2025-04-10T01:00:00.000Z",
    };

    expect(toArchiveTravelPost(post)).toEqual({
      id: "post-1",
      userId: "user-1",
      visitId: "visit-1",
      title: "Tokyo arrival",
      content: "Landed and explored Shibuya.",
      countryCode: "JP",
      cityName: "Tokyo",
      createdAt: "2025-04-10T00:00:00.000Z",
      updatedAt: "2025-04-10T01:00:00.000Z",
    });
  });
});
