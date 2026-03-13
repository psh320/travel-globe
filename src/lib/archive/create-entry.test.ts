import { describe, expect, it } from "vitest";

import {
  buildPhotoAssetDraft,
  buildTravelPostDraft,
  buildVisitDraft,
} from "@/lib/archive/create-entry";

describe("archive create helpers", () => {
  it("builds a normalized visit draft from create input", () => {
    expect(
      buildVisitDraft({
        countryCode: "jp",
        countryName: "Japan",
        inferredConfidenceLevel: "medium",
        sourceType: "text",
        userId: "user-1",
        visitId: "visit-1",
        visitedAt: "2025-04-10T00:00:00.000Z",
      }),
    ).toEqual(
      expect.objectContaining({
        country_code: "JP",
        country_name: "Japan",
        source_type: "text",
        location_confidence: "medium",
      }),
    );
  });

  it("builds a travel post only when content exists", () => {
    expect(
      buildTravelPostDraft({
        content: "Landed and explored Shibuya.",
        countryCode: "JP",
        countryName: "Japan",
        sourceType: "text",
        title: "Tokyo arrival",
        userId: "user-1",
        visitId: "visit-1",
      }),
    ).toEqual(
      expect.objectContaining({
        content: "Landed and explored Shibuya.",
        country_code: "JP",
        visit_id: "visit-1",
      }),
    );

    expect(
      buildTravelPostDraft({
        countryCode: "JP",
        countryName: "Japan",
        sourceType: "photo",
        userId: "user-1",
        visitId: "visit-1",
      }),
    ).toBeNull();
  });

  it("builds a photo asset draft with a deterministic storage path", () => {
    expect(
      buildPhotoAssetDraft({
        countryCode: "FR",
        countryName: "France",
        fileName: "Paris Sunset.JPG",
        fileSizeBytes: 1234,
        inferredConfidenceLevel: "low",
        inferredCountryCode: "FR",
        inferredCountryName: "France",
        mimeType: "image/jpeg",
        photoAssetId: "asset-1",
        sourceType: "photo",
        userId: "user-1",
        visitId: "visit-1",
      }),
    ).toEqual(
      expect.objectContaining({
        file_name: "Paris Sunset.JPG",
        inferred_country_code: "FR",
        inferred_country_name: "France",
        inferred_location_confidence: "low",
        storage_path: "user-1/visit-1/asset-1/paris-sunset.jpg",
        visit_id: "visit-1",
      }),
    );
  });
});
