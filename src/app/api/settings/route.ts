import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

// GET — Public: fetch all settings as a key-value object
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value, label, category");

    if (error) {
      console.error("Settings fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }

    // Convert array to key-value object
    const settings: Record<string, string> = {};
    const settingsWithMeta: Record<string, { value: string; label: string; category: string }> = {};
    
    for (const row of data || []) {
      settings[row.key] = row.value;
      settingsWithMeta[row.key] = {
        value: row.value,
        label: row.label || row.key,
        category: row.category || "general",
      };
    }

    return NextResponse.json({ settings, settingsWithMeta });
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT — Admin only: update one or more settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { updates } = body; // { key: value, key2: value2, ... }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json({ error: "Updates object is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const errors: string[] = [];

    for (const [key, value] of Object.entries(updates)) {
      const { error } = await adminClient
        .from("site_settings")
        .upsert({ key, value: value as string, updated_at: new Date().toISOString() }, { onConflict: "key" });

      if (error) {
        errors.push(`Failed to update ${key}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
