import {
  normalizeVisit,
  type ArchiveVisitEntry,
  type VisitRecord,
} from "@/lib/archive";
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

export type ArchivePhotoAsset = {
  id: string;
  userId: string;
  visitId: string;
  storageBucket: string;
  storagePath: string;
  fileName: string;
  mimeType: string | null;
  fileSizeBytes: number | null;
  capturedAt: string | null;
  exifLatitude: number | null;
  exifLongitude: number | null;
  inferredCountryCode: string | null;
  inferredCountryName: string | null;
  inferredCityName: string | null;
  inferredLatitude: number | null;
  inferredLongitude: number | null;
  inferredLocationConfidence: PersistedPhotoAssetRow["inferred_location_confidence"];
  metadata: Json;
  publicUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PhotoAssetUrlResolver = (
  asset: PersistedPhotoAssetRow,
) => Promise<string | null> | string | null;

export type ArchiveTravelPost = {
  id: string;
  userId: string;
  visitId: string;
  title: string | null;
  content: string;
  countryCode: string;
  cityName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArchiveVisitDetail = {
  visit: VisitRecord;
  visitRow: PersistedVisitRecord;
  photos: ArchivePhotoAsset[];
  posts: ArchiveTravelPost[];
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

export function toArchiveVisitEntry(
  visitDetail: ArchiveVisitDetail,
): ArchiveVisitEntry {
  return {
    visit: normalizeVisit(visitDetail.visit),
    photoAssetCount: visitDetail.photos.length,
    travelPostCount: visitDetail.posts.length,
  };
}

export function toArchiveVisitEntries(
  visitDetails: ArchiveVisitDetail[],
): ArchiveVisitEntry[] {
  return visitDetails.map(toArchiveVisitEntry);
}

export async function toArchivePhotoAsset(
  asset: PersistedPhotoAssetRow,
  resolvePublicUrl?: PhotoAssetUrlResolver,
): Promise<ArchivePhotoAsset> {
  const publicUrl = resolvePublicUrl ? await resolvePublicUrl(asset) : null;

  return {
    id: asset.id,
    userId: asset.user_id,
    visitId: asset.visit_id,
    storageBucket: asset.storage_bucket,
    storagePath: asset.storage_path,
    fileName: asset.file_name,
    mimeType: asset.mime_type,
    fileSizeBytes: asset.file_size_bytes,
    capturedAt: asset.captured_at,
    exifLatitude: asset.exif_latitude,
    exifLongitude: asset.exif_longitude,
    inferredCountryCode: asset.inferred_country_code,
    inferredCountryName: asset.inferred_country_name,
    inferredCityName: asset.inferred_city_name,
    inferredLatitude: asset.inferred_latitude,
    inferredLongitude: asset.inferred_longitude,
    inferredLocationConfidence: asset.inferred_location_confidence,
    metadata: asset.metadata,
    publicUrl,
    createdAt: asset.created_at,
    updatedAt: asset.updated_at,
  };
}

export function toArchiveTravelPost(
  post: PersistedTravelPostRecord,
): ArchiveTravelPost {
  return {
    id: post.id,
    userId: post.user_id,
    visitId: post.visit_id,
    title: post.title,
    content: post.content,
    countryCode: post.country_code,
    cityName: post.city_name,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };
}
