import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  PhotoAssetRecord,
  PersistedPhotoAssetRow,
  PersistedTravelPostRecord,
  PersistedVisitRecord,
  VisitDraft,
  VisitBundle,
  VisitLocationPatch,
} from "@/lib/supabase/types";
import {
  toArchiveVisitRecord,
  toPhotoAssetRecord,
  type PhotoAssetUrlResolver,
} from "@/lib/supabase/types";
import type { Database } from "@/types/database";

type DbClient = SupabaseClient<Database>;
type VisitWithRelations = PersistedVisitRecord & {
  photo_assets: PersistedPhotoAssetRow[];
  travel_posts: PersistedTravelPostRecord[];
};

export async function listVisitsForUser(
  supabase: DbClient,
  userId: string,
  resolvePhotoUrl?: PhotoAssetUrlResolver,
) {
  const { data, error } = await supabase
    .from("visits")
    .select("*, photo_assets(*), travel_posts(*)")
    .eq("user_id", userId)
    .order("visited_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return Promise.all(
    (data as VisitWithRelations[]).map(
      async ({ photo_assets, travel_posts, ...visit }): Promise<VisitBundle> => ({
        visit: toArchiveVisitRecord(visit),
        visitRow: visit,
        photos: await Promise.all(
          photo_assets.map((asset): Promise<PhotoAssetRecord> =>
            toPhotoAssetRecord(asset, resolvePhotoUrl),
          ),
        ),
        posts: travel_posts,
      }),
    ),
  );
}

export async function createVisit(
  supabase: DbClient,
  userId: string,
  draft: VisitDraft,
) {
  const { data, error } = await supabase
    .from("visits")
    .insert({
      ...draft,
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateVisitLocation(
  supabase: DbClient,
  visitId: string,
  patch: VisitLocationPatch,
) {
  const { data, error } = await supabase
    .from("visits")
    .update(patch)
    .eq("id", visitId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
