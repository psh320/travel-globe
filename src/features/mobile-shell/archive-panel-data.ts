import {
  UNKNOWN_CITY_LABEL,
  getCountryDetailSummary,
  normalizeVisit,
  type ArchiveVisitEntry,
  type CountryDetailSummary,
  type WorldMapCountrySummary,
} from "@/lib/archive";
import type { ArchiveVisitDetail } from "@/lib/supabase";

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

export type WorldArchivePanelData = {
  summaryCards: DetailListCard[];
  memoryCards: DetailListCard[];
};

export type CountryArchivePanelData = {
  summary: CountryDetailSummary | null;
  stats: DetailStat[];
  cityCards: DetailListCard[];
  memoryCards: DetailListCard[];
};

function formatCount(value: number, singular: string, plural = `${singular}s`) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function formatConfidenceLabel(value?: string | null) {
  if (!value) {
    return null;
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)} confidence`;
}

function formatVisitDate(value?: string | null) {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function truncateText(value?: string | null, maxLength = 110) {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();

  if (!normalized) {
    return undefined;
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function sortEntriesByDate(entries: ArchiveVisitEntry[]) {
  return [...entries].sort((left, right) => {
    const leftVisit = normalizeVisit(left.visit);
    const rightVisit = normalizeVisit(right.visit);

    const leftDate = leftVisit.visitedAt ?? leftVisit.createdAt ?? "";
    const rightDate = rightVisit.visitedAt ?? rightVisit.createdAt ?? "";

    return rightDate.localeCompare(leftDate);
  });
}

export function buildArchiveMemoryCards(
  entries: ArchiveVisitEntry[],
  visitDetails: ArchiveVisitDetail[] = [],
  countryCode?: string | null,
): DetailListCard[] {
  const detailByVisitId = new Map(
    visitDetails.map((detail) => [detail.visit.id, detail]),
  );

  return sortEntriesByDate(entries)
    .filter((entry) => {
      const visit = normalizeVisit(entry.visit);
      return !countryCode || visit.countryCode === countryCode;
    })
    .map((entry) => {
      const visit = normalizeVisit(entry.visit);
      const detail = detailByVisitId.get(visit.id);
      const locationLabel = visit.countryName ?? visit.countryCode ?? "Unknown country";
      const title =
        visit.cityName && visit.cityName !== UNKNOWN_CITY_LABEL
          ? visit.cityName
          : locationLabel;
      const subtitle = [
        locationLabel,
        visit.sourceType === "photo" ? "Photo visit" : "Text entry",
        formatVisitDate(visit.visitedAt),
      ].join(" • ");
      const supportingText = truncateText(
        detail?.posts[0]?.title ?? detail?.posts[0]?.content,
      );

      return {
        id: visit.id,
        title,
        subtitle,
        supportingText,
        meta: [
          formatCount(entry.photoAssetCount, "photo"),
          formatCount(entry.travelPostCount, "post"),
          formatConfidenceLabel(visit.confidenceLevel),
        ].filter((value): value is string => Boolean(value)),
      };
    });
}

export function buildWorldArchivePanelData(
  countrySummaries: WorldMapCountrySummary[],
  entries: ArchiveVisitEntry[],
  visitDetails: ArchiveVisitDetail[] = [],
): WorldArchivePanelData {
  return {
    summaryCards: countrySummaries.slice(0, 4).map((summary) => ({
      id: summary.countryCode,
      title: summary.countryName,
      subtitle: `${summary.countryCode} • ${formatCount(summary.visitCount, "entry", "entries")}`,
      meta: [
        formatCount(summary.uniqueCityCount, "city", "cities"),
        formatCount(summary.photoAssetCount, "photo"),
        formatCount(summary.travelPostCount, "post"),
      ],
    })),
    memoryCards: buildArchiveMemoryCards(entries, visitDetails).slice(0, 6),
  };
}

export function buildCountryArchivePanelData(
  entries: ArchiveVisitEntry[],
  visitDetails: ArchiveVisitDetail[] = [],
  countryCode?: string | null,
): CountryArchivePanelData {
  if (!countryCode) {
    return {
      summary: null,
      stats: [],
      cityCards: [],
      memoryCards: [],
    };
  }

  const summary = getCountryDetailSummary(entries, countryCode);

  if (!summary) {
    return {
      summary: null,
      stats: [],
      cityCards: [],
      memoryCards: [],
    };
  }

  return {
    summary,
    stats: [
      { label: "Entries", value: String(summary.countrySummary.visitCount) },
      { label: "Cities", value: String(summary.countrySummary.uniqueCityCount) },
      { label: "Photos", value: String(summary.photoAssetCount) },
      { label: "Posts", value: String(summary.travelPostCount) },
    ],
    cityCards: summary.cityGroups.map((city) => ({
      id: `${city.countryCode}:${city.cityName}`,
      title: city.cityName,
      subtitle: `${formatCount(city.visitCount, "entry", "entries")} • Last saved ${formatVisitDate(city.lastVisitedAt)}`,
      meta: [
        formatCount(city.photoAssetCount, "photo"),
        formatCount(city.travelPostCount, "post"),
        city.photoVisitCount > 0
          ? formatCount(city.photoVisitCount, "photo visit", "photo visits")
          : null,
        city.textVisitCount > 0
          ? formatCount(city.textVisitCount, "text entry", "text entries")
          : null,
      ].filter((value): value is string => Boolean(value)),
    })),
    memoryCards: buildArchiveMemoryCards(entries, visitDetails, summary.countryCode),
  };
}
