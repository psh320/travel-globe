import { getTheme, getThemeBucketCount } from "@/lib/color-scale/themes";

export function clampIntensity(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1);
}

export function calculateRelativeIntensity(count: number, maxCount: number): number {
  if (count <= 0 || maxCount <= 0) {
    return 0;
  }

  return clampIntensity(count / maxCount);
}

export function applyThemeIntensity(
  normalizedIntensity: number,
  themeName?: string | null,
): number {
  const theme = getTheme(themeName);
  return clampIntensity(normalizedIntensity) ** theme.intensityExponent;
}

export function getIntensityBucket(
  normalizedIntensity: number,
  bucketCount: number,
): number {
  const clampedIntensity = clampIntensity(normalizedIntensity);

  if (clampedIntensity <= 0 || bucketCount <= 0) {
    return 0;
  }

  return Math.min(bucketCount, Math.ceil(clampedIntensity * bucketCount));
}

export function getThemedIntensityBucket(
  normalizedIntensity: number,
  themeName?: string | null,
): number {
  const themedIntensity = applyThemeIntensity(normalizedIntensity, themeName);
  return getIntensityBucket(themedIntensity, getThemeBucketCount(themeName));
}
