import type { SupabaseClient } from "@supabase/supabase-js";

import {
  toArchiveTravelPost,
  type ArchiveTravelPost,
  type PersistedTravelPostRecord,
  type TravelPostDraft,
} from "@/lib/supabase/types";
import type { Database } from "@/types/database";

type DbClient = SupabaseClient<Database>;

export async function createTravelPost(
  supabase: DbClient,
  userId: string,
  draft: TravelPostDraft,
): Promise<ArchiveTravelPost> {
  const { data, error } = await supabase
    .from("travel_posts")
    .insert({
      ...draft,
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toArchiveTravelPost(data as PersistedTravelPostRecord);
}

export async function listTravelPostsForVisit(
  supabase: DbClient,
  visitId: string,
): Promise<ArchiveTravelPost[]> {
  const { data, error } = await supabase
    .from("travel_posts")
    .select("*")
    .eq("visit_id", visitId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as PersistedTravelPostRecord[]).map(toArchiveTravelPost);
}

export async function listTravelPostsForUser(
  supabase: DbClient,
  userId: string,
): Promise<ArchiveTravelPost[]> {
  const { data, error } = await supabase
    .from("travel_posts")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as PersistedTravelPostRecord[]).map(toArchiveTravelPost);
}
