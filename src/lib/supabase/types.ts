import { normalizeVisit, type VisitRecord } from "@/lib/archive";
import type { Json, Row } from "@/types/database";

export type ProfileRecord = Row<"profiles">;
export type PersistedVisitRecord = Row<"visits">;
export type PersistedPhotoAssetRow = Row<"photo_assets">;
export type PersistedTravelPostRecord = Row<"travel_posts">;

export type VisitDraft = Pick<
  PersistedVisitRecord,
  | "country_code"
  | "country_name"
  | "city_name"
  | "latitude"
  | "longitude"
  | "source_type"
  | "location_confidence"
  | "visited_at"
> & {
  id?: string;
};

export type VisitLocationPatch = Pick<
  PersistedVisitRecord,
  "country_code" | "country_name" | "city_name" | "latitude" | "longitude"
> & {
  location_confidence: PersistedVisitRecord["location_confidence"];
};

export type PhotoAssetDraft = Pick<
  PersistedPhotoAssetRow,
  | "visit_id"
  | "file_name"
  | "storage_path"
  | "captured_at"
  | "mime_type"
  | "file_size_bytes"
  | "exif_latitude"
  | "exif_longitude"
  | "inferred_country_code"
  | "inferred_country_name"
  | "inferred_city_name"
  | "inferred_latitude"
  | "inferred_longitude"
  | "inferred_location_confidence"
  | "metadata"
> & {
  id?: string;
  storage_bucket?: string;
};

export type TravelPostDraft = Pick<
  PersistedTravelPostRecord,
  "visit_id" | "title" | "content" | "country_code" | "city_name"
> & {
  id?: string;
};

export type ExifLocationSnapshot = {
  exifLatitude: number | null;
  exifLongitude: number | null;
  capturedAt: string | null;
  inferredCountryCode: string | null;
  inferredCountryName: string | null;
  inferredCityName: string | null;
  inferredLatitude: number | null;
  inferredLongitude: number | null;
  inferredLocationConfidence: PersistedPhotoAssetRow["inferred_location_confidence"];
  metadata: Json;
};

export type PhotoAssetRecord = PersistedPhotoAssetRow & {
  public_url: string | null;
};

export type PhotoAssetUrlResolver = (
  asset: PersistedPhotoAssetRow,
) => Promise<string | null> | string | null;

export type VisitBundle = {
  visit: VisitRecord;
  visitRow: PersistedVisitRecord;
  photos: PhotoAssetRecord[];
  posts: PersistedTravelPostRecord[];
};

export function toArchiveVisitRecord(
  visit: PersistedVisitRecord,
): VisitRecord {
  return normalizeVisit({
    id: visit.id,
    userId: visit.user_id,
    countryCode: visit.country_code,
    countryName: visit.country_name,
    cityName: visit.city_name,
    latitude: visit.latitude,
    longitude: visit.longitude,
    sourceType: visit.source_type,
    confidenceLevel: visit.location_confidence,
    visitedAt: visit.visited_at,
    createdAt: visit.created_at,
    updatedAt: visit.updated_at,
  });
}

export async function toPhotoAssetRecord(
  asset: PersistedPhotoAssetRow,
  resolvePublicUrl?: PhotoAssetUrlResolver,
): Promise<PhotoAssetRecord> {
  const publicUrl = resolvePublicUrl ? await resolvePublicUrl(asset) : null;

  return {
    ...asset,
    public_url: publicUrl,
  };
}
