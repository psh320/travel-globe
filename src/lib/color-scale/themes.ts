export interface TravelTheme {
  name: string;
  label: string;
  emptyColor: string;
  bucketColors: string[];
  intensityExponent: number;
}

export const DEFAULT_THEME_NAME = "red";

export const travelThemes: Record<string, TravelTheme> = {
  red: {
    name: "red",
    label: "Sunset Red",
    emptyColor: "#E5E7EB",
    bucketColors: ["#FDE2E2", "#F9B4B4", "#F37C7C", "#E04848", "#B91C1C"],
    intensityExponent: 0.85,
  },
  ocean: {
    name: "ocean",
    label: "Ocean Blue",
    emptyColor: "#E2E8F0",
    bucketColors: ["#DBF0FF", "#A8D8FF", "#6AB7F5", "#2D87D3", "#0F4C81"],
    intensityExponent: 1.05,
  },
};

export function getTheme(themeName?: string | null): TravelTheme {
  if (!themeName) {
    return travelThemes[DEFAULT_THEME_NAME];
  }

  return travelThemes[themeName] ?? travelThemes[DEFAULT_THEME_NAME];
}

export function getThemeBucketCount(themeName?: string | null): number {
  return getTheme(themeName).bucketColors.length;
}

export function getThemeColor(themeName: string | null | undefined, bucket: number): string {
  const theme = getTheme(themeName);

  if (bucket <= 0) {
    return theme.emptyColor;
  }

  const bucketIndex = Math.min(bucket, theme.bucketColors.length) - 1;
  return theme.bucketColors[bucketIndex];
}
