import type { SupabaseClient } from "@supabase/supabase-js";

import { TRAVEL_PHOTOS_BUCKET } from "@/lib/supabase/constants";
import {
  toPhotoAssetRecord,
  type PhotoAssetDraft,
  type PersistedPhotoAssetRow,
  type PhotoAssetUrlResolver,
} from "@/lib/supabase/types";
import type { Database } from "@/types/database";

type DbClient = SupabaseClient<Database>;

export async function createPhotoAsset(
  supabase: DbClient,
  userId: string,
  draft: PhotoAssetDraft,
  resolvePublicUrl?: PhotoAssetUrlResolver,
) {
  const { data, error } = await supabase
    .from("photo_assets")
    .insert({
      ...draft,
      storage_bucket: draft.storage_bucket ?? TRAVEL_PHOTOS_BUCKET,
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toPhotoAssetRecord(data as PersistedPhotoAssetRow, resolvePublicUrl);
}

export async function listPhotoAssetsForVisit(
  supabase: DbClient,
  visitId: string,
  resolvePublicUrl?: PhotoAssetUrlResolver,
) {
  const { data, error } = await supabase
    .from("photo_assets")
    .select("*")
    .eq("visit_id", visitId)
    .order("captured_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return Promise.all(
    (data as PersistedPhotoAssetRow[]).map((asset) =>
      toPhotoAssetRecord(asset, resolvePublicUrl),
    ),
  );
}
