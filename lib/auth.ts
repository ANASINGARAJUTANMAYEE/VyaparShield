import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "./supabase/server";

export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { error: NextResponse.json({ error: "Authentication required." }, { status: 401 }) } as const;
  return { supabase, user } as const;
}
