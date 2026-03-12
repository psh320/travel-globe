import { getCountrySummaries, getCitySummaries } from "@/lib/archive/summaries";
import type {
  CityMapSummary,
  CountryMapSummary,
  IntensitySummary,
  VisitRecord,
} from "@/lib/archive/types";
import {
  applyThemeIntensity,
  calculateRelativeIntensity,
  getIntensityBucket,
} from "@/lib/color-scale/intensity";
import { getThemeColor, getThemeBucketCount } from "@/lib/color-scale/themes";

export interface MapSummaryOptions {
  themeName?: string | null;
}

function createIntensitySummary(
  count: number,
  maxCount: number,
  themeName?: string | null,
): IntensitySummary {
  const normalizedIntensity = calculateRelativeIntensity(count, maxCount);
  const themedIntensity = applyThemeIntensity(normalizedIntensity, themeName);
  const intensityBucket = getIntensityBucket(
    themedIntensity,
    getThemeBucketCount(themeName),
  );

  return {
    normalizedIntensity,
    themedIntensity,
    intensityBucket,
  };
}

export function getCountryMapSummaries(
  visits: VisitRecord[],
  options: MapSummaryOptions = {},
): CountryMapSummary[] {
  const countrySummaries = getCountrySummaries(visits);
  const maxVisitCount = Math.max(0, ...countrySummaries.map((summary) => summary.visitCount));

  return countrySummaries.map((summary) => {
    const intensity = createIntensitySummary(
      summary.visitCount,
      maxVisitCount,
      options.themeName,
    );

    return {
      ...summary,
      ...intensity,
      fillColor: getThemeColor(options.themeName, intensity.intensityBucket),
    };
  });
}

export function getCityMapSummaries(
  visits: VisitRecord[],
  countryCode?: string | null,
  options: MapSummaryOptions = {},
): CityMapSummary[] {
  const citySummaries = getCitySummaries(visits, countryCode);
  const maxVisitCount = Math.max(0, ...citySummaries.map((summary) => summary.visitCount));

  return citySummaries.map((summary) => {
    const intensity = createIntensitySummary(
      summary.visitCount,
      maxVisitCount,
      options.themeName,
    );

    return {
      ...summary,
      ...intensity,
      fillColor: getThemeColor(options.themeName, intensity.intensityBucket),
    };
  });
}
