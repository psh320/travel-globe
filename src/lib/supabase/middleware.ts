import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getOptionalSupabaseBrowserEnv,
  isSupabaseAuthMiddlewareEnabled,
} from "@/lib/env";
import type { Database } from "@/types/database";

export function updateSupabaseSession(request: NextRequest) {
  if (!isSupabaseAuthMiddlewareEnabled()) {
    return NextResponse.next({
      request,
    });
  }

  const supabaseEnv = getOptionalSupabaseBrowserEnv();

  if (!supabaseEnv) {
    return NextResponse.next({
      request,
    });
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  void supabase.auth.getUser();

  return response;
}
