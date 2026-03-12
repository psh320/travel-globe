import type { CountryMapSummary } from "@/lib/archive";

export type PanelTab = "overview" | "archive" | "upload";

export type MobileCountrySummary = CountryMapSummary;

export type ArchiveHighlight = {
  id: string;
  title: string;
  subtitle: string;
};
