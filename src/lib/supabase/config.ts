/**
 * Sanitizes and validates Supabase environment variables to prevent runtime crashes
 */
export function getSanitizedSupabaseConfig() {
  let url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/^['"]|['"]$/g, "");
  let anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim().replace(/^['"]|['"]$/g, "");

  if (!url || url === "your-supabase-url" || url === "your-project") {
    url = "https://placeholder-project.supabase.co";
  } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  try {
    new URL(url);
  } catch {
    url = "https://placeholder-project.supabase.co";
  }

  if (!anonKey) {
    anonKey = "placeholder-anon-key";
  }

  return { url, anonKey };
}
