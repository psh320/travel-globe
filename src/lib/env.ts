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

function readOptionalEnv(name: string) {
  return process.env[name] || null;
}

export function getOptionalSupabaseBrowserEnv() {
  const url = readOptionalEnv(requiredClientEnv[0]);
  const anonKey = readOptionalEnv(requiredClientEnv[1]);

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function getOptionalSupabaseServerEnv() {
  const browserEnv = getOptionalSupabaseBrowserEnv();
  const serviceRoleKey = readOptionalEnv(requiredServerEnv[2]);

  if (!browserEnv || !serviceRoleKey) {
    return null;
  }

  return {
    ...browserEnv,
    serviceRoleKey,
  };
}

export function getSupabaseBrowserEnv() {
  return (
    getOptionalSupabaseBrowserEnv() ?? {
      url: readEnv(requiredClientEnv[0]),
      anonKey: readEnv(requiredClientEnv[1]),
    }
  );
}

export function getSupabaseServerEnv() {
  return (
    getOptionalSupabaseServerEnv() ?? {
      ...getSupabaseBrowserEnv(),
      serviceRoleKey: readEnv(requiredServerEnv[2]),
    }
  );
}

export function getOptionalAppEnv() {
  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Travel Globe",
    defaultTheme: process.env.NEXT_PUBLIC_DEFAULT_THEME ?? "red",
  };
}

export function isSupabaseAuthMiddlewareEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_SUPABASE_AUTH_MIDDLEWARE === "true";
}
