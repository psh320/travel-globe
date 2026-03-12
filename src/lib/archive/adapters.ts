import {
  createArchiveVisitEntries,
  getCityGroupingSummaries,
  getWorldMapCountrySummaries,
  type MapSummaryOptions,
} from "@/lib/archive/selectors";
import type {
  CityMapSummary,
  CountryMapSummary,
  VisitRecord,
} from "@/lib/archive/types";

export function getCountryMapSummaries(
  visits: VisitRecord[],
  options: MapSummaryOptions = {},
): CountryMapSummary[] {
  return getWorldMapCountrySummaries(createArchiveVisitEntries(visits), options).map(
    (summary) => ({
      countryCode: summary.countryCode,
      countryName: summary.countryName,
      visitCount: summary.visitCount,
      photoVisitCount: summary.photoVisitCount,
      textVisitCount: summary.textVisitCount,
      uniqueCityCount: summary.uniqueCityCount,
      lastVisitedAt: summary.lastVisitedAt,
      normalizedIntensity: summary.normalizedIntensity,
      themedIntensity: summary.themedIntensity,
      intensityBucket: summary.intensityBucket,
      fillColor: summary.fillColor,
    }),
  );
}

export function getCityMapSummaries(
  visits: VisitRecord[],
  countryCode?: string | null,
  options: MapSummaryOptions = {},
): CityMapSummary[] {
  return getCityGroupingSummaries(
    createArchiveVisitEntries(visits),
    countryCode,
    options,
  ).map((summary) => ({
    countryCode: summary.countryCode,
    countryName: summary.countryName,
    cityName: summary.cityName,
    visitCount: summary.visitCount,
    photoVisitCount: summary.photoVisitCount,
    textVisitCount: summary.textVisitCount,
    lastVisitedAt: summary.lastVisitedAt,
    normalizedIntensity: summary.normalizedIntensity,
    themedIntensity: summary.themedIntensity,
    intensityBucket: summary.intensityBucket,
    fillColor: summary.fillColor,
  }));
}
