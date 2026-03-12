import type { ArchiveSummary } from "@/features/map/types";

export function createArchiveIndex(archiveData: ArchiveSummary[]) {
  return new Map(archiveData.map((entry) => [entry.countryName, entry]));
}

export function getMaxVisitCount(archiveData: ArchiveSummary[]) {
  return archiveData.reduce((maxCount, entry) => Math.max(maxCount, entry.visitCount), 0);
}

export function getRelativeIntensity(visitCount: number, maxVisitCount: number) {
  if (visitCount <= 0 || maxVisitCount <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, visitCount / maxVisitCount));
}

export function getCountryFill({
  intensity,
  isHovered,
  isSelected,
}: {
  intensity: number;
  isHovered: boolean;
  isSelected: boolean;
}) {
  if (isSelected) {
    return "#d9b58f";
  }

  if (isHovered) {
    return intensity > 0 ? "#ead2ba" : "#eeece6";
  }

  if (intensity <= 0) {
    return "#f7f5ef";
  }

  const shade = Math.round(247 - intensity * 48);
  const green = Math.round(245 - intensity * 42);
  const blue = Math.round(239 - intensity * 56);

  return `rgb(${shade}, ${green}, ${blue})`;
}
