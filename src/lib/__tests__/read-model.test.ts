import { describe, expect, it } from "vitest";

import { createArchiveVisitEntriesFromDetails } from "@/lib/supabase/read-model";
import type { ArchiveVisitDetail } from "@/lib/supabase/types";

describe("persisted archive read model", () => {
  it("builds archive entries with persisted photo and post counts", () => {
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
    ];

    expect(createArchiveVisitEntriesFromDetails(details)).toEqual([
      {
        visit: expect.objectContaining({
          id: "visit-1",
          countryCode: "JP",
        }),
        photoAssetCount: 2,
        travelPostCount: 1,
      },
    ]);
  });
});
