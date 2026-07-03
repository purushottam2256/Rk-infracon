import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = createAdminClient();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { error: "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local" },
        { status: 400 }
      );
    }

    // Create admin user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm so they can login immediately
    });

    if (error) {
      // User may already exist
      if (error.message?.includes("already been registered") || error.message?.includes("already exists")) {
        return NextResponse.json({
          success: true,
          message: "Admin user already exists. Database should be seeded via SQL Editor.",
          sqlEditorUrl: `https://supabase.com/dashboard/project/vrbszbrtbzhgjwaoumvv/sql`,
        });
      }

      console.error("Auth user creation error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create admin user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully! Now run the schema.sql in Supabase SQL Editor to seed data.",
      userId: data.user?.id,
      sqlEditorUrl: `https://supabase.com/dashboard/project/vrbszbrtbzhgjwaoumvv/sql`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed. Make sure SUPABASE_SERVICE_ROLE_KEY is set." },
      { status: 500 }
    );
  }
}
