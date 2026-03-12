const requiredClientEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const requiredServerEnv = [...requiredClientEnv, "SUPABASE_SERVICE_ROLE_KEY"] as const;

function readEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseBrowserEnv() {
  return {
    url: readEnv(requiredClientEnv[0]),
    anonKey: readEnv(requiredClientEnv[1]),
  };
}

export function getSupabaseServerEnv() {
  return {
    ...getSupabaseBrowserEnv(),
    serviceRoleKey: readEnv(requiredServerEnv[2]),
  };
}

export function getOptionalAppEnv() {
  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Travel Globe",
    defaultTheme: process.env.NEXT_PUBLIC_DEFAULT_THEME ?? "red",
  };
}
