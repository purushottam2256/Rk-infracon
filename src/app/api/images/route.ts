import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

const STORAGE_BUCKET = "site-images";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: images, error } = await supabase
      .from("site_images")
      .select("*")
      .order("section");

    if (error) {
      console.error("Images fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch images" },
        { status: 500 }
      );
    }

    return NextResponse.json({ images: images || [] });
  } catch (error) {
    console.error("Images fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const key = formData.get("key") as string;
    const section = formData.get("section") as string;
    const alt = formData.get("alt") as string;

    if (!file || !key || !section) {
      return NextResponse.json(
        { error: "File, key, and section are required" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Generate a unique file path
    const fileExt = file.name.split(".").pop() || "jpg";
    const filePath = `${section}/${key}-${Date.now()}.${fileExt}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if old image exists and delete from storage
    const { data: existing } = await adminClient
      .from("site_images")
      .select("storage_path")
      .eq("key", key)
      .single();

    if (existing?.storage_path) {
      await adminClient.storage
        .from(STORAGE_BUCKET)
        .remove([existing.storage_path]);
    }

    // Upload to Supabase Storage
    const { error: uploadError } = await adminClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = adminClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Upsert the image record in the database
    const { data: image, error: dbError } = await adminClient
      .from("site_images")
      .upsert(
        {
          key,
          url: publicUrl,
          storage_path: filePath,
          alt: alt || "",
          section,
        },
        { onConflict: "key" }
      )
      .select()
      .single();

    if (dbError) {
      console.error("Supabase DB upsert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save image record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key } = await request.json();
    const adminClient = createAdminClient();

    // Get the storage path
    const { data: image } = await adminClient
      .from("site_images")
      .select("storage_path")
      .eq("key", key)
      .single();

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete from Supabase Storage
    if (image.storage_path) {
      await adminClient.storage
        .from(STORAGE_BUCKET)
        .remove([image.storage_path]);
    }

    // Delete DB record
    await adminClient.from("site_images").delete().eq("key", key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Image delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
