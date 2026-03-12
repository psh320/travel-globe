import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  PhotoAssetRecord,
  TravelPostRecord,
  VisitAggregate,
  VisitDraft,
  VisitLocationPatch,
  VisitRecord,
} from "@/types/archive";
import type { Database } from "@/types/database";

type DbClient = SupabaseClient<Database>;
type VisitWithRelations = VisitRecord & {
  photo_assets: PhotoAssetRecord[];
  travel_posts: TravelPostRecord[];
};

export async function listVisitsForUser(supabase: DbClient, userId: string) {
  const { data, error } = await supabase
    .from("visits")
    .select("*, photo_assets(*), travel_posts(*)")
    .eq("user_id", userId)
    .order("visited_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as VisitWithRelations[]).map(
    ({ photo_assets, travel_posts, ...visit }): VisitAggregate => ({
      visit,
      photos: photo_assets,
      posts: travel_posts,
    }),
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
