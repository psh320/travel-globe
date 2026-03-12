import type { Database, Json, Row } from "@/types/database";

export type VisitSourceType = Database["public"]["Enums"]["visit_source_type"];
export type LocationConfidenceLevel =
  Database["public"]["Enums"]["location_confidence_level"];

export type Profile = Row<"profiles">;
export type VisitRecord = Row<"visits">;
export type PhotoAssetRecord = Row<"photo_assets">;
export type TravelPostRecord = Row<"travel_posts">;

export type VisitDraft = Pick<
  VisitRecord,
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
  VisitRecord,
  "country_code" | "country_name" | "city_name" | "latitude" | "longitude"
> & {
  location_confidence: LocationConfidenceLevel;
};

export type PhotoAssetDraft = Pick<
  PhotoAssetRecord,
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
  TravelPostRecord,
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
  inferredLocationConfidence: LocationConfidenceLevel | null;
  metadata: Json;
};

export type ArchiveVisit = {
  visit: VisitRecord;
  photos: PhotoAssetRecord[];
  posts: TravelPostRecord[];
};

export type VisitAggregate = ArchiveVisit;
