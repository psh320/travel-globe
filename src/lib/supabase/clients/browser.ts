"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseBrowserEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseBrowserEnv();

  return createBrowserClient<Database>(url, anonKey);
}
