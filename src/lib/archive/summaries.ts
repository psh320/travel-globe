import {
  UNKNOWN_CITY_LABEL,
  getLatestIsoDate,
  normalizeCityName,
  normalizeCountryCode,
  normalizeVisit,
} from "@/lib/archive/normalization";
import type {
  ArchiveCounts,
  CitySummary,
  CountrySummary,
  VisitRecord,
} from "@/lib/archive/types";

export function getArchiveCounts(visits: VisitRecord[]): ArchiveCounts {
  const normalizedVisits = visits.map(normalizeVisit);
  const countries = new Set<string>();
  const cities = new Set<string>();

  let photoVisits = 0;
  let textVisits = 0;
  let visitsWithCountry = 0;
  let visitsWithCity = 0;

  for (const visit of normalizedVisits) {
    if (visit.sourceType === "photo") {
      photoVisits += 1;
    } else {
      textVisits += 1;
    }

    if (visit.countryCode) {
      visitsWithCountry += 1;
      countries.add(visit.countryCode);
    }

    if (visit.countryCode && visit.cityName) {
      visitsWithCity += 1;
      cities.add(`${visit.countryCode}:${visit.cityName}`);
    }
  }

  return {
    totalVisits: normalizedVisits.length,
    countriesVisited: countries.size,
    citiesVisited: cities.size,
    photoVisits,
    textVisits,
    visitsWithCountry,
    visitsWithCity,
  };
}

export function getCountrySummaries(visits: VisitRecord[]): CountrySummary[] {
  const grouped = new Map<string, CountrySummary>();

  for (const visit of visits.map(normalizeVisit)) {
    if (!visit.countryCode || !visit.countryName) {
      continue;
    }

    const existing = grouped.get(visit.countryCode);

    if (existing) {
      existing.visitCount += 1;
      existing.lastVisitedAt = getLatestIsoDate(existing.lastVisitedAt, visit.visitedAt);

      if (visit.sourceType === "photo") {
        existing.photoVisitCount += 1;
      } else {
        existing.textVisitCount += 1;
      }

      if (visit.cityName) {
        existing.uniqueCityCount += 0;
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
    });
  }

  const citySets = new Map<string, Set<string>>();
  for (const visit of visits.map(normalizeVisit)) {
    if (!visit.countryCode || !visit.cityName) {
      continue;
    }

    const countryCities = citySets.get(visit.countryCode) ?? new Set<string>();
    countryCities.add(visit.cityName);
    citySets.set(visit.countryCode, countryCities);
  }

  for (const [countryCode, summary] of grouped) {
    summary.uniqueCityCount = citySets.get(countryCode)?.size ?? 0;
  }

  return [...grouped.values()].sort((left, right) => {
    if (right.visitCount !== left.visitCount) {
      return right.visitCount - left.visitCount;
    }

    return left.countryName.localeCompare(right.countryName);
  });
}

export function getCitySummaries(
  visits: VisitRecord[],
  countryCode?: string | null,
): CitySummary[] {
  const normalizedCountryCode = normalizeCountryCode(countryCode);
  const grouped = new Map<string, CitySummary>();

  for (const visit of visits.map(normalizeVisit)) {
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
    });
  }

  return [...grouped.values()].sort((left, right) => {
    if (right.visitCount !== left.visitCount) {
      return right.visitCount - left.visitCount;
    }

    return left.cityName.localeCompare(right.cityName);
  });
}
