import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

// GET — Public: fetch gallery images
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_images")
      .select("*")
      .eq("section", "gallery")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
    }

    return NextResponse.json({ images: data || [] });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// POST — Admin only: add gallery image
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, alt, key } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const imageKey = key || `gallery-${Date.now()}`;

    const { data, error } = await adminClient
      .from("site_images")
      .insert({
        key: imageKey,
        url,
        alt: alt || "",
        section: "gallery",
      })
      .select()
      .single();

    if (error) {
      console.error("Gallery insert error:", error);
      return NextResponse.json({ error: "Failed to add image" }, { status: 500 });
    }

    return NextResponse.json({ success: true, image: data }, { status: 201 });
  } catch (error) {
    console.error("Gallery add error:", error);
    return NextResponse.json({ error: "Failed to add image" }, { status: 500 });
  }
}

// DELETE — Admin only: remove gallery image
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Get image to find storage path
    const { data: image } = await adminClient
      .from("site_images")
      .select("storage_path")
      .eq("id", id)
      .single();

    // Delete from storage if path exists
    if (image?.storage_path) {
      await adminClient.storage.from("site-images").remove([image.storage_path]);
    }

    // Delete from DB
    const { error } = await adminClient
      .from("site_images")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
