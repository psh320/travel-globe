import { describe, expect, it } from "vitest";

import { inferCountryFromCoordinates } from "@/lib/geo/country-inference";

describe("inferCountryFromCoordinates", () => {
  it("returns null when coordinates are missing", () => {
    expect(inferCountryFromCoordinates(null, 139.69)).toBeNull();
    expect(inferCountryFromCoordinates(35.67, null)).toBeNull();
  });

  it("infers Japan near Tokyo with a high confidence match", () => {
    expect(inferCountryFromCoordinates(35.6764, 139.65)).toEqual(
      expect.objectContaining({
        countryCode: "JP",
        countryName: "Japan",
        confidenceLevel: "high",
      }),
    );
  });

  it("infers France near Paris", () => {
    expect(inferCountryFromCoordinates(48.8566, 2.3522)).toEqual(
      expect.objectContaining({
        countryCode: "FR",
        countryName: "France",
      }),
    );
  });
});
