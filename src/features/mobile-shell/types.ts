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

export type DetailStat = {
  label: string;
  value: string;
};

export type DetailListCard = {
  id: string;
  title: string;
  subtitle: string;
  supportingText?: string;
  meta: string[];
};
