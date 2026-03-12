import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/clients/server";

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireSessionUser() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Authenticated user required");
  }

  return user;
}
