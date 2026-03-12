import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { ProfileRecord } from "@/lib/supabase/types";

type DbClient = SupabaseClient<Database>;

export async function getProfile(supabase: DbClient, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function upsertProfile(
  supabase: DbClient,
  profile: Pick<
    ProfileRecord,
    "id" | "display_name" | "home_airport_code" | "preferred_map_theme"
  >,
) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(profile)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
