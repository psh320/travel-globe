import type { MapHostSnapshot } from "@/features/map/types";
import type { CountryMapSummary } from "@/lib/archive";

import type { MobileSelectedCountry, PanelTab } from "./types";

export function syncPanelTabWithMapSnapshot(
  currentTab: PanelTab | null,
  snapshot: MapHostSnapshot,
): PanelTab | null {
  if (snapshot.viewMode === "country") {
    return currentTab ?? "overview";
  }

  if (currentTab === "overview") {
    return null;
  }

  return currentTab;
}

export function deriveSelectedCountry(
  selectedCountryCode: string | null,
  countrySummaries: CountryMapSummary[],
): MobileSelectedCountry | null {
  if (!selectedCountryCode) {
    return null;
  }

  const summary =
    countrySummaries.find((country) => country.countryCode === selectedCountryCode) ??
    null;

  return {
    countryCode: selectedCountryCode,
    displayName: summary?.countryName ?? selectedCountryCode,
    summary,
  };
}
