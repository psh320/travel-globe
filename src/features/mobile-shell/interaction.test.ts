import { describe, expect, it } from "vitest";

import {
  closeCountryDetail,
  handleCountryTap,
  openSelectedCountry,
} from "./interaction";

describe("mobile country interaction", () => {
  it("selects a country on the first tap without opening detail", () => {
    expect(
      handleCountryTap(
        { selectedCountryCode: null, isDetailOpen: false },
        "JP",
      ),
    ).toEqual({
      selectedCountryCode: "JP",
      isDetailOpen: false,
    });
  });

  it("opens detail on the second tap for the same country", () => {
    expect(
      handleCountryTap(
        { selectedCountryCode: "JP", isDetailOpen: false },
        "JP",
      ),
    ).toEqual({
      selectedCountryCode: "JP",
      isDetailOpen: true,
    });
  });

  it("opens detail from an explicit action when a country is selected", () => {
    expect(
      openSelectedCountry({ selectedCountryCode: "IS", isDetailOpen: false }),
    ).toEqual({
      selectedCountryCode: "IS",
      isDetailOpen: true,
    });
  });

  it("keeps the selection when the detail view closes", () => {
    expect(
      closeCountryDetail({ selectedCountryCode: "BR", isDetailOpen: true }),
    ).toEqual({
      selectedCountryCode: "BR",
      isDetailOpen: false,
    });
  });
});
