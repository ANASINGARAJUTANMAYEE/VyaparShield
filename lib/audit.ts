import type { SupabaseClient } from "@supabase/supabase-js";

export async function audit(client: SupabaseClient, values: { actorId: string; businessId: string; targetId?: string; eventType: string; metadata?: Record<string, unknown> }) {
  const { error } = await client.from("audit_events").insert({
    actor_id: values.actorId,
    business_id: values.businessId,
    target_id: values.targetId ?? null,
    event_type: values.eventType,
    metadata: values.metadata ?? {},
  });
  if (error) {
    console.error("Unable to write audit event", error.message);
    throw new Error(`audit_write_failed: ${error.message}`);
  }
}
