import type { VisitRecord } from "@/lib/archive/types";

export const UNKNOWN_CITY_LABEL = "Unknown city";

export function normalizeCountryCode(countryCode?: string | null): string | null {
  const normalized = countryCode?.trim().toUpperCase();
  return normalized ? normalized : null;
}

export function normalizeCountryName(
  countryName?: string | null,
  fallbackCountryCode?: string | null,
): string | null {
  const normalized = countryName?.trim();
  if (normalized) {
    return normalized;
  }

  return fallbackCountryCode ?? null;
}

export function normalizeCityName(cityName?: string | null): string | null {
  const normalized = cityName?.trim();
  return normalized ? normalized : null;
}

export function normalizeVisit(visit: VisitRecord): VisitRecord {
  const countryCode = normalizeCountryCode(visit.countryCode);
  const countryName = normalizeCountryName(visit.countryName, countryCode);
  const cityName = normalizeCityName(visit.cityName);

  return {
    ...visit,
    countryCode,
    countryName,
    cityName,
  };
}

export function getLatestIsoDate(
  current: string | null,
  candidate?: string | null,
): string | null {
  if (!candidate) {
    return current;
  }

  if (!current) {
    return candidate;
  }

  const currentTimestamp = Date.parse(current);
  const candidateTimestamp = Date.parse(candidate);

  if (Number.isNaN(candidateTimestamp)) {
    return current;
  }

  if (Number.isNaN(currentTimestamp)) {
    return candidate;
  }

  return candidateTimestamp > currentTimestamp ? candidate : current;
}
