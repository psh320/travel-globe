import { normalizeCountryCode } from "@/lib/archive";
import { buildPhotoAssetPath } from "@/lib/supabase";
import type {
  PhotoAssetDraft,
  TravelPostDraft,
  VisitDraft,
} from "@/lib/supabase";

export type ArchiveCreateInput = {
  cityName?: string | null;
  content?: string | null;
  countryCode: string;
  countryName: string;
  fileName?: string | null;
  fileSizeBytes?: number | null;
  inferredLatitude?: number | null;
  inferredLongitude?: number | null;
  mimeType?: string | null;
  sourceType: "photo" | "text";
  title?: string | null;
  userId: string;
  visitId: string;
  photoAssetId?: string | null;
  visitedAt?: string | null;
};

export function normalizeCreateInput(input: ArchiveCreateInput) {
  const countryCode = normalizeCountryCode(input.countryCode);

  if (!countryCode) {
    throw new Error("Country code is required");
  }

  const countryName = input.countryName.trim();

  if (!countryName) {
    throw new Error("Country name is required");
  }

  const cityName = input.cityName?.trim() || null;
  const title = input.title?.trim() || null;
  const content = input.content?.trim() || null;

  return {
    ...input,
    cityName,
    content,
    countryCode,
    countryName,
    title,
    visitedAt: input.visitedAt || null,
  };
}

export function buildVisitDraft(input: ArchiveCreateInput): VisitDraft {
  const normalized = normalizeCreateInput(input);

  return {
    id: normalized.visitId,
    city_name: normalized.cityName,
    country_code: normalized.countryCode,
    country_name: normalized.countryName,
    latitude: normalized.inferredLatitude ?? null,
    longitude: normalized.inferredLongitude ?? null,
    location_confidence: "manual",
    source_type: normalized.sourceType,
    visited_at: normalized.visitedAt || null,
  };
}

export function buildTravelPostDraft(
  input: ArchiveCreateInput,
): TravelPostDraft | null {
  const normalized = normalizeCreateInput(input);

  if (!normalized.content) {
    return null;
  }

  return {
    city_name: normalized.cityName,
    content: normalized.content,
    country_code: normalized.countryCode,
    title: normalized.title,
    visit_id: normalized.visitId,
  };
}

export function buildPhotoAssetDraft(
  input: ArchiveCreateInput,
): PhotoAssetDraft | null {
  const normalized = normalizeCreateInput(input);

  if (normalized.sourceType !== "photo" || !normalized.photoAssetId || !normalized.fileName) {
    return null;
  }

  return {
    id: normalized.photoAssetId,
    visit_id: normalized.visitId,
    file_name: normalized.fileName,
    file_size_bytes: normalized.fileSizeBytes ?? null,
    captured_at: normalized.visitedAt || null,
    mime_type: normalized.mimeType ?? null,
    storage_path: buildPhotoAssetPath({
      userId: normalized.userId,
      visitId: normalized.visitId,
      photoAssetId: normalized.photoAssetId,
      fileName: normalized.fileName,
    }),
    exif_latitude: normalized.inferredLatitude ?? null,
    exif_longitude: normalized.inferredLongitude ?? null,
    inferred_country_code: null,
    inferred_country_name: null,
    inferred_city_name: null,
    inferred_latitude: normalized.inferredLatitude ?? null,
    inferred_longitude: normalized.inferredLongitude ?? null,
    inferred_location_confidence:
      normalized.inferredLatitude !== null && normalized.inferredLongitude !== null
        ? "low"
        : null,
    metadata: {},
  };
}
