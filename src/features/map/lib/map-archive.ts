import { mockVisitRecords } from "@/features/map/data/mock-visit-records";
import {
  getCountryMapSummaries,
  type CountryMapSummary,
  type VisitRecord,
} from "@/lib/archive";

type ResolveMapCountrySummariesOptions = {
  countrySummaries?: CountryMapSummary[] | null;
  themeName?: string | null;
  visits?: VisitRecord[] | null;
};

export function createMapArchiveIndex(countrySummaries: CountryMapSummary[]) {
  return new Map(countrySummaries.map((summary) => [summary.countryCode, summary]));
}

export function resolveMapCountrySummaries({
  countrySummaries,
  themeName,
  visits,
}: ResolveMapCountrySummariesOptions): CountryMapSummary[] {
  if (countrySummaries) {
    return countrySummaries;
  }

  if (visits) {
    return getCountryMapSummaries(visits, { themeName });
  }

  return getCountryMapSummaries(mockVisitRecords, { themeName });
}
