import { describe, expect, it } from "vitest";

import {
  deriveSelectedCountry,
  syncPanelTabWithMapSnapshot,
} from "./integration-state";

describe("mobile shell integration state", () => {
  it("opens overview when the map enters country focus", () => {
    expect(
      syncPanelTabWithMapSnapshot(null, {
        selectedCountryCode: "JP",
        viewMode: "country",
        focusedCountry: null,
        selectedCountry: null,
      }),
    ).toBe("overview");
  });

  it("closes the overview sheet when the map returns to world view", () => {
    expect(
      syncPanelTabWithMapSnapshot("overview", {
        selectedCountryCode: "JP",
        viewMode: "world",
        focusedCountry: null,
        selectedCountry: null,
      }),
    ).toBeNull();
  });

  it("keeps non-overview tabs open when the map returns to world view", () => {
    expect(
      syncPanelTabWithMapSnapshot("upload", {
        selectedCountryCode: "JP",
        viewMode: "world",
        focusedCountry: null,
        selectedCountry: null,
      }),
    ).toBe("upload");
  });

  it("derives a selected country so shell-rail selection can open detail", () => {
    expect(
      deriveSelectedCountry("JP", [
        {
          countryCode: "JP",
          countryName: "Japan",
          visitCount: 3,
          photoVisitCount: 2,
          textVisitCount: 1,
          uniqueCityCount: 3,
          lastVisitedAt: "2025-07-21T00:00:00.000Z",
          normalizedIntensity: 1,
          themedIntensity: 1,
          intensityBucket: 5,
          fillColor: "#B91C1C",
        },
      ]),
    ).toEqual({
      countryCode: "JP",
      displayName: "Japan",
      summary: {
        countryCode: "JP",
        countryName: "Japan",
        visitCount: 3,
        photoVisitCount: 2,
        textVisitCount: 1,
        uniqueCityCount: 3,
        lastVisitedAt: "2025-07-21T00:00:00.000Z",
        normalizedIntensity: 1,
        themedIntensity: 1,
        intensityBucket: 5,
        fillColor: "#B91C1C",
      },
    });
  });
});
