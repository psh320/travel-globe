export type VisitSourceType = "photo" | "text";

export type VisitConfidenceLevel = "high" | "medium" | "low" | "manual";

export interface VisitRecord {
  id: string;
  userId?: string;
  countryCode?: string | null;
  countryName?: string | null;
  cityName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  sourceType: VisitSourceType;
  confidenceLevel?: VisitConfidenceLevel;
  visitedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ArchiveVisitEntry {
  visit: VisitRecord;
  photoAssetCount: number;
  travelPostCount: number;
}

export interface ArchiveCounts {
  totalVisits: number;
  countriesVisited: number;
  citiesVisited: number;
  photoVisits: number;
  textVisits: number;
  visitsWithCountry: number;
  visitsWithCity: number;
}

export interface CountrySummary {
  countryCode: string;
  countryName: string;
  visitCount: number;
  photoVisitCount: number;
  textVisitCount: number;
  uniqueCityCount: number;
  lastVisitedAt: string | null;
}

export interface CitySummary {
  countryCode: string;
  countryName: string;
  cityName: string;
  visitCount: number;
  photoVisitCount: number;
  textVisitCount: number;
  lastVisitedAt: string | null;
}

export interface IntensitySummary {
  normalizedIntensity: number;
  themedIntensity: number;
  intensityBucket: number;
}

export interface CountryMapSummary extends CountrySummary, IntensitySummary {
  fillColor: string;
}

export interface CityMapSummary extends CitySummary, IntensitySummary {
  fillColor: string;
}

export interface WorldMapCountrySummary extends CountryMapSummary {
  photoAssetCount: number;
  travelPostCount: number;
}

export interface CityGroupSummary extends CityMapSummary {
  photoAssetCount: number;
  travelPostCount: number;
  visitIds: string[];
}

export interface CountryDetailSummary {
  countryCode: string;
  countryName: string;
  countrySummary: WorldMapCountrySummary;
  archiveCounts: ArchiveCounts;
  cityGroups: CityGroupSummary[];
  photoAssetCount: number;
  travelPostCount: number;
}
