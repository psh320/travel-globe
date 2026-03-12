import { TRAVEL_PHOTOS_BUCKET } from "@/lib/supabase/constants";

function sanitizeFileName(fileName: string) {
  const trimmed = fileName.trim().toLowerCase();

  return trimmed
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildPhotoAssetPath(params: {
  userId: string;
  visitId: string;
  photoAssetId: string;
  fileName: string;
}) {
  const sanitizedFileName = sanitizeFileName(params.fileName) || "upload";

  return `${params.userId}/${params.visitId}/${params.photoAssetId}/${sanitizedFileName}`;
}

export function getPhotoAssetObjectPath(storagePath: string) {
  return `${TRAVEL_PHOTOS_BUCKET}/${storagePath}`;
}
