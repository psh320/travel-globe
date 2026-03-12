import countries from "world-countries";

const numericToAlpha2 = new Map(
  countries
    .filter((country) => country.ccn3 && country.cca2)
    .map((country) => [country.ccn3.padStart(3, "0"), country.cca2]),
);

const nameFallbacks = new Map<string, string>([
  ["Kosovo", "XK"],
  ["N. Cyprus", "CY"],
  ["Somaliland", "SO"],
]);

export function getAlpha2CountryCode({
  numericCode,
  displayName,
}: {
  numericCode?: string;
  displayName: string;
}) {
  if (numericCode) {
    const normalizedCode = numericCode.padStart(3, "0");
    const alpha2Code = numericToAlpha2.get(normalizedCode);

    if (alpha2Code) {
      return alpha2Code;
    }
  }

  return nameFallbacks.get(displayName) ?? null;
}
