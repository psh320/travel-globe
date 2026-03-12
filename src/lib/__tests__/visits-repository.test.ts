import { describe, expect, it } from "vitest";

import {
  listArchiveVisitsForUser,
  listVisitsForUser,
} from "@/lib/supabase/repositories/visits";
import type {
  PersistedPhotoAssetRow,
  PersistedTravelPostRecord,
  PersistedVisitRecord,
} from "@/lib/supabase/types";

describe("visits repository", () => {
  it("returns visit details adapted for the shared archive and future UI layers", async () => {
    const asset: PersistedPhotoAssetRow = {
      id: "asset-1",
      user_id: "user-1",
      visit_id: "visit-1",
      storage_bucket: "travel-photos",
      storage_path: "user-1/visit-1/asset-1/photo.jpg",
      file_name: "photo.jpg",
      mime_type: "image/jpeg",
      file_size_bytes: 1234,
      captured_at: "2026-03-12T00:00:00.000Z",
      exif_latitude: null,
      exif_longitude: null,
      inferred_country_code: "JP",
      inferred_country_name: "Japan",
      inferred_city_name: "Tokyo",
      inferred_latitude: null,
      inferred_longitude: null,
      inferred_location_confidence: "medium",
      metadata: {},
      created_at: "2026-03-12T00:00:00.000Z",
      updated_at: "2026-03-12T00:00:00.000Z",
    };

    const post: PersistedTravelPostRecord = {
      id: "post-1",
      user_id: "user-1",
      visit_id: "visit-1",
      title: "Tokyo arrival",
      content: "Landed and explored Shibuya.",
      country_code: "JP",
      city_name: "Tokyo",
      created_at: "2026-03-12T00:00:00.000Z",
      updated_at: "2026-03-12T01:00:00.000Z",
    };

    const visit: PersistedVisitRecord = {
      id: "visit-1",
      user_id: "user-1",
      country_code: "jp",
      country_name: "Japan",
      city_name: "Tokyo",
      latitude: 35.6764,
      longitude: 139.65,
      source_type: "photo",
      location_confidence: "medium",
      visited_at: "2026-03-12T00:00:00.000Z",
      created_at: "2026-03-12T00:00:00.000Z",
      updated_at: "2026-03-12T01:00:00.000Z",
      photo_assets: [asset],
      travel_posts: [post],
    } as PersistedVisitRecord & {
      photo_assets: PersistedPhotoAssetRow[];
      travel_posts: PersistedTravelPostRecord[];
    };

    const supabase = {
      from(table: string) {
        expect(table).toBe("visits");

        return {
          select() {
            return {
              eq(column: string, value: string) {
                expect(column).toBe("user_id");
                expect(value).toBe("user-1");
                return {
                  order() {
                    return {
                      order: async () => ({
                        data: [visit],
                        error: null,
                      }),
                    };
                  },
                };
              },
            };
          },
        };
      },
    } as never;

    const details = await listVisitsForUser(
      supabase,
      "user-1",
      (row) => `https://example.test/${row.storage_path}`,
    );

    expect(details).toEqual([
      expect.objectContaining({
        visit: expect.objectContaining({
          id: "visit-1",
          countryCode: "JP",
          confidenceLevel: "medium",
        }),
        photos: [
          expect.objectContaining({
            id: "asset-1",
            publicUrl: "https://example.test/user-1/visit-1/asset-1/photo.jpg",
          }),
        ],
        posts: [
          expect.objectContaining({
            id: "post-1",
            cityName: "Tokyo",
          }),
        ],
      }),
    ]);
  });

  it("returns shared archive visit records for map/color consumers", async () => {
    const visit: PersistedVisitRecord = {
      id: "visit-2",
      user_id: "user-1",
      country_code: "fr",
      country_name: "France",
      city_name: "Paris",
      latitude: null,
      longitude: null,
      source_type: "text",
      location_confidence: "manual",
      visited_at: "2026-03-10T00:00:00.000Z",
      created_at: "2026-03-10T00:00:00.000Z",
      updated_at: "2026-03-11T00:00:00.000Z",
    };

    const supabase = {
      from(table: string) {
        expect(table).toBe("visits");

        return {
          select() {
            return {
              eq(column: string, value: string) {
                expect(column).toBe("user_id");
                expect(value).toBe("user-1");
                return {
                  order() {
                    return {
                      order: async () => ({
                        data: [visit],
                        error: null,
                      }),
                    };
                  },
                };
              },
            };
          },
        };
      },
    } as never;

    await expect(listArchiveVisitsForUser(supabase, "user-1")).resolves.toEqual([
      expect.objectContaining({
        id: "visit-2",
        countryCode: "FR",
        sourceType: "text",
        confidenceLevel: "manual",
      }),
    ]);
  });
});
