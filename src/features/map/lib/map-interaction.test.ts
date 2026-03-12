import { describe, expect, it } from "vitest";

import {
  clearMapSelection,
  createMapHostSnapshot,
  defaultMapInteractionState,
  dismissMapInteraction,
  getFocusedCountryCode,
  openFocusedCountry,
  pressMapCountry,
  returnToWorld,
} from "@/features/map/lib/map-interaction";

describe("map interaction helpers", () => {
  it("selects a country on first press and focuses on second press", () => {
    const selectedState = pressMapCountry(defaultMapInteractionState, "JP");
    const focusedState = pressMapCountry(selectedState, "JP");

    expect(selectedState).toEqual({
      selectedCountryCode: "JP",
      viewMode: "world",
    });
    expect(focusedState).toEqual({
      selectedCountryCode: "JP",
      viewMode: "country",
    });
  });

  it("opens focus explicitly without changing the selected country", () => {
    expect(
      openFocusedCountry({
        selectedCountryCode: "FR",
        viewMode: "world",
      }),
    ).toEqual({
      selectedCountryCode: "FR",
      viewMode: "country",
    });
  });

  it("returns to the world view without dropping the selected country", () => {
    expect(
      returnToWorld({
        selectedCountryCode: "TH",
        viewMode: "country",
      }),
    ).toEqual({
      selectedCountryCode: "TH",
      viewMode: "world",
    });
  });

  it("dismisses focus first, then clears world selection", () => {
    const worldState = dismissMapInteraction({
      selectedCountryCode: "CA",
      viewMode: "country",
    });
    const clearedState = dismissMapInteraction(worldState);

    expect(worldState).toEqual({
      selectedCountryCode: "CA",
      viewMode: "world",
    });
    expect(clearedState).toEqual(clearMapSelection());
  });

  it("derives the focused country and host snapshot cleanly", () => {
    const snapshot = createMapHostSnapshot(
      {
        selectedCountryCode: "US",
        viewMode: "country",
      },
      {
        countryCode: "US",
        displayName: "United States of America",
        summary: null,
      },
    );

    expect(getFocusedCountryCode(snapshot)).toBe("US");
    expect(snapshot.focusedCountry?.countryCode).toBe("US");
  });
});
