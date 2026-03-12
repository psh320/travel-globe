import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ArchiveVisitDetail,
  PersistedPhotoAssetRow,
  PersistedTravelPostRecord,
  PersistedVisitRecord,
  VisitDraft,
  VisitLocationPatch,
} from "@/lib/supabase/types";
import {
  toArchivePhotoAsset,
  toArchiveTravelPost,
  toArchiveVisitRecord,
  type PhotoAssetUrlResolver,
} from "@/lib/supabase/types";
import type { Database } from "@/types/database";
import type { VisitRecord } from "@/lib/archive";

type DbClient = SupabaseClient<Database>;
type VisitWithRelations = PersistedVisitRecord & {
  photo_assets: PersistedPhotoAssetRow[];
  travel_posts: PersistedTravelPostRecord[];
};

export async function listVisitsForUser(
  supabase: DbClient,
  userId: string,
  resolvePhotoUrl?: PhotoAssetUrlResolver,
): Promise<ArchiveVisitDetail[]> {
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
      async ({ photo_assets, travel_posts, ...visit }): Promise<ArchiveVisitDetail> => ({
        visit: toArchiveVisitRecord(visit),
        visitRow: visit,
        photos: await Promise.all(
          photo_assets.map((asset) =>
            toArchivePhotoAsset(asset, resolvePhotoUrl),
          ),
        ),
        posts: travel_posts.map(toArchiveTravelPost),
      }),
    ),
  );
}

export async function listArchiveVisitsForUser(
  supabase: DbClient,
  userId: string,
): Promise<VisitRecord[]> {
  const { data, error } = await supabase
    .from("visits")
    .select("*")
    .eq("user_id", userId)
    .order("visited_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as PersistedVisitRecord[]).map(toArchiveVisitRecord);
}

export async function createVisit(
  supabase: DbClient,
  userId: string,
  draft: VisitDraft,
): Promise<VisitRecord> {
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

  return toArchiveVisitRecord(data as PersistedVisitRecord);
}

export async function updateVisitLocation(
  supabase: DbClient,
  visitId: string,
  patch: VisitLocationPatch,
): Promise<VisitRecord> {
  const { data, error } = await supabase
    .from("visits")
    .update(patch)
    .eq("id", visitId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toArchiveVisitRecord(data as PersistedVisitRecord);
}
