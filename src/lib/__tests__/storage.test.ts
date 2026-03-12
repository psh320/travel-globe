import { describe, expect, it } from "vitest";

import {
  buildPhotoAssetPath,
  getPhotoAssetObjectPath,
} from "@/lib/supabase/storage";

describe("storage helpers", () => {
  it("builds a deterministic storage path using the ownership convention", () => {
    expect(
      buildPhotoAssetPath({
        userId: "user-1",
        visitId: "visit-1",
        photoAssetId: "asset-1",
        fileName: "My Summer Photo.JPG",
      }),
    ).toBe("user-1/visit-1/asset-1/my-summer-photo.jpg");
  });

  it("prefixes bucket names for object references", () => {
    expect(getPhotoAssetObjectPath("user-1/visit-1/asset-1/photo.jpg")).toBe(
      "travel-photos/user-1/visit-1/asset-1/photo.jpg",
    );
  });
});
