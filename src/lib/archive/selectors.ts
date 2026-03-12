import {
  UNKNOWN_CITY_LABEL,
  getLatestIsoDate,
  normalizeCityName,
  normalizeCountryCode,
  normalizeVisit,
} from "@/lib/archive/normalization";
import { getArchiveCounts } from "@/lib/archive/summaries";
import type {
  ArchiveVisitEntry,
  CityGroupSummary,
  CountryDetailSummary,
  WorldMapCountrySummary,
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

type CountryAggregate = {
  countryCode: string;
  countryName: string;
  visitCount: number;
  photoVisitCount: number;
  textVisitCount: number;
  uniqueCityCount: number;
  lastVisitedAt: string | null;
  photoAssetCount: number;
  travelPostCount: number;
};

type CityAggregate = {
  countryCode: string;
  countryName: string;
  cityName: string;
  visitCount: number;
  photoVisitCount: number;
  textVisitCount: number;
  lastVisitedAt: string | null;
  photoAssetCount: number;
  travelPostCount: number;
  visitIds: string[];
};

function createIntensitySummary(
  count: number,
  maxCount: number,
  themeName?: string | null,
) {
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

export function createArchiveVisitEntries(
  visits: VisitRecord[],
): ArchiveVisitEntry[] {
  return visits.map((visit) => ({
    visit: normalizeVisit(visit),
    photoAssetCount: 0,
    travelPostCount: 0,
  }));
}

export function getWorldMapCountrySummaries(
  entries: ArchiveVisitEntry[],
  options: MapSummaryOptions = {},
): WorldMapCountrySummary[] {
  const grouped = new Map<string, CountryAggregate>();

  for (const entry of entries) {
    const visit = normalizeVisit(entry.visit);

    if (!visit.countryCode || !visit.countryName) {
      continue;
    }

    const existing = grouped.get(visit.countryCode);

    if (existing) {
      existing.visitCount += 1;
      existing.lastVisitedAt = getLatestIsoDate(existing.lastVisitedAt, visit.visitedAt);
      existing.photoAssetCount += entry.photoAssetCount;
      existing.travelPostCount += entry.travelPostCount;

      if (visit.sourceType === "photo") {
        existing.photoVisitCount += 1;
      } else {
        existing.textVisitCount += 1;
      }

      continue;
    }

    grouped.set(visit.countryCode, {
      countryCode: visit.countryCode,
      countryName: visit.countryName,
      visitCount: 1,
      photoVisitCount: visit.sourceType === "photo" ? 1 : 0,
      textVisitCount: visit.sourceType === "text" ? 1 : 0,
      uniqueCityCount: 0,
      lastVisitedAt: visit.visitedAt ?? null,
      photoAssetCount: entry.photoAssetCount,
      travelPostCount: entry.travelPostCount,
    });
  }

  const citySets = new Map<string, Set<string>>();
  for (const entry of entries) {
    const visit = normalizeVisit(entry.visit);

    if (!visit.countryCode || !visit.cityName) {
      continue;
    }

    const countryCities = citySets.get(visit.countryCode) ?? new Set<string>();
    countryCities.add(visit.cityName);
    citySets.set(visit.countryCode, countryCities);
  }

  const summaries = [...grouped.values()];
  const maxVisitCount = Math.max(0, ...summaries.map((summary) => summary.visitCount));

  return summaries
    .map((summary) => {
      summary.uniqueCityCount = citySets.get(summary.countryCode)?.size ?? 0;
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
    })
    .sort((left, right) => {
      if (right.visitCount !== left.visitCount) {
        return right.visitCount - left.visitCount;
      }

      return left.countryName.localeCompare(right.countryName);
    });
}

export function getCityGroupingSummaries(
  entries: ArchiveVisitEntry[],
  countryCode?: string | null,
  options: MapSummaryOptions = {},
): CityGroupSummary[] {
  const normalizedCountryCode = normalizeCountryCode(countryCode);
  const grouped = new Map<string, CityAggregate>();

  for (const entry of entries) {
    const visit = normalizeVisit(entry.visit);

    if (!visit.countryCode || !visit.countryName) {
      continue;
    }

    if (normalizedCountryCode && visit.countryCode !== normalizedCountryCode) {
      continue;
    }

    const cityName = normalizeCityName(visit.cityName) ?? UNKNOWN_CITY_LABEL;
    const cityKey = `${visit.countryCode}:${cityName}`;
    const existing = grouped.get(cityKey);

    if (existing) {
      existing.visitCount += 1;
      existing.lastVisitedAt = getLatestIsoDate(existing.lastVisitedAt, visit.visitedAt);
      existing.photoAssetCount += entry.photoAssetCount;
      existing.travelPostCount += entry.travelPostCount;
      existing.visitIds.push(visit.id);

      if (visit.sourceType === "photo") {
        existing.photoVisitCount += 1;
      } else {
        existing.textVisitCount += 1;
      }

      continue;
    }

    grouped.set(cityKey, {
      countryCode: visit.countryCode,
      countryName: visit.countryName,
      cityName,
      visitCount: 1,
      photoVisitCount: visit.sourceType === "photo" ? 1 : 0,
      textVisitCount: visit.sourceType === "text" ? 1 : 0,
      lastVisitedAt: visit.visitedAt ?? null,
      photoAssetCount: entry.photoAssetCount,
      travelPostCount: entry.travelPostCount,
      visitIds: [visit.id],
    });
  }

  const summaries = [...grouped.values()];
  const maxVisitCount = Math.max(0, ...summaries.map((summary) => summary.visitCount));

  return summaries
    .map((summary) => {
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
    })
    .sort((left, right) => {
      if (right.visitCount !== left.visitCount) {
        return right.visitCount - left.visitCount;
      }

      return left.cityName.localeCompare(right.cityName);
    });
}

export function getCountryDetailSummary(
  entries: ArchiveVisitEntry[],
  countryCode: string,
  options: MapSummaryOptions = {},
): CountryDetailSummary | null {
  const normalizedCountryCode = normalizeCountryCode(countryCode);

  if (!normalizedCountryCode) {
    return null;
  }

  const countrySummary =
    getWorldMapCountrySummaries(entries, options).find(
      (summary) => summary.countryCode === normalizedCountryCode,
    ) ?? null;

  if (!countrySummary) {
    return null;
  }

  const countryEntries = entries.filter(
    (entry) => normalizeVisit(entry.visit).countryCode === normalizedCountryCode,
  );

  return {
    countryCode: countrySummary.countryCode,
    countryName: countrySummary.countryName,
    countrySummary,
    archiveCounts: getArchiveCounts(countryEntries.map((entry) => entry.visit)),
    cityGroups: getCityGroupingSummaries(countryEntries, normalizedCountryCode, options),
    photoAssetCount: countryEntries.reduce(
      (total, entry) => total + entry.photoAssetCount,
      0,
    ),
    travelPostCount: countryEntries.reduce(
      (total, entry) => total + entry.travelPostCount,
      0,
    ),
  };
}
