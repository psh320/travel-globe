import { describe, expect, it } from "vitest";

import { getAlpha2CountryCode } from "@/features/map/lib/country-code-map";

describe("country code normalization", () => {
  it("maps numeric atlas identifiers to alpha-2 codes", () => {
    expect(getAlpha2CountryCode({ numericCode: "392", displayName: "Japan" })).toBe("JP");
    expect(getAlpha2CountryCode({ numericCode: "250", displayName: "France" })).toBe("FR");
  });

  it("uses stable fallbacks for atlas regions without numeric ids", () => {
    expect(getAlpha2CountryCode({ displayName: "Kosovo" })).toBe("XK");
    expect(getAlpha2CountryCode({ displayName: "N. Cyprus" })).toBe("CY");
    expect(getAlpha2CountryCode({ displayName: "Somaliland" })).toBe("SO");
  });
});
