import type { CountryMapSummary } from "@/lib/archive";

export type PanelTab = "overview" | "archive" | "upload";

export type MobileCountrySummary = CountryMapSummary;

export type MobileSelectedCountry = {
  countryCode: string;
  displayName: string;
  summary: CountryMapSummary | null;
};

export type ArchiveHighlight = {
  id: string;
  title: string;
  subtitle: string;
};
