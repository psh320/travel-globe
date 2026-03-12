import { describe, expect, it } from "vitest";

import { listPhotoAssetsForVisit } from "@/lib/supabase/repositories/photo-assets";
import type { PersistedPhotoAssetRow } from "@/lib/supabase/types";

describe("photo assets repository", () => {
  it("derives public_url at read time through the resolver", async () => {
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

    const supabase = {
      from(table: string) {
        expect(table).toBe("photo_assets");

        return {
          select() {
            return {
              eq(column: string, value: string) {
                expect(column).toBe("visit_id");
                expect(value).toBe("visit-1");
                return {
                  order() {
                    return {
                      order: async () => ({
                        data: [asset],
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

    const result = await listPhotoAssetsForVisit(
      supabase,
      "visit-1",
      (row) => `https://example.test/${row.storage_path}`,
    );

    expect(result).toEqual([
      expect.objectContaining({
        id: "asset-1",
        public_url: "https://example.test/user-1/visit-1/asset-1/photo.jpg",
      }),
    ]);
  });
});
