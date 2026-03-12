import { afterEach, describe, expect, it } from "vitest";

import {
  getOptionalAppEnv,
  getSupabaseBrowserEnv,
  getSupabaseServerEnv,
} from "@/lib/env";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("env helpers", () => {
  it("reads browser-safe supabase env", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    expect(getSupabaseBrowserEnv()).toEqual({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
    });
  });

  it("throws when required env is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => getSupabaseBrowserEnv()).toThrow(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL",
    );
  });

  it("reads server-only and optional env values", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

    expect(getSupabaseServerEnv()).toEqual({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      serviceRoleKey: "service-role-key",
    });
    expect(getOptionalAppEnv()).toEqual({
      appName: "Travel Globe",
      defaultTheme: "red",
    });
  });
});
