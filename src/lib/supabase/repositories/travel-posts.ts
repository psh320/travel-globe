import type { SupabaseClient } from "@supabase/supabase-js";

import type { TravelPostDraft } from "@/lib/supabase/types";
import type { Database } from "@/types/database";

type DbClient = SupabaseClient<Database>;

export async function createTravelPost(
  supabase: DbClient,
  userId: string,
  draft: TravelPostDraft,
) {
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

  return data;
}

export async function listTravelPostsForVisit(
  supabase: DbClient,
  visitId: string,
) {
  const { data, error } = await supabase
    .from("travel_posts")
    .select("*")
    .eq("visit_id", visitId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
