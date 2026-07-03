import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

const STORAGE_BUCKET = "site-images";

/**
 * Upload image to Supabase Storage with automatic old-image cleanup.
 * Expects FormData with:
 *   - file: the image file (already compressed on client)
 *   - folder: storage folder (e.g., "projects", "hero", "gallery")
 *   - old_url: (optional) previous image URL to delete from storage
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";
    const oldUrl = formData.get("old_url") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const storagePrefix = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/`;

    // Delete old image from storage if provided
    if (oldUrl && oldUrl.startsWith(storagePrefix)) {
      const oldPath = oldUrl.replace(storagePrefix, "");
      await adminClient.storage.from(STORAGE_BUCKET).remove([oldPath]);
    }

    // Generate short unique filename: folder/timestamp-random.ext
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "webp";
    const shortId = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const filePath = `${folder}/${shortId}.${fileExt}`;

    // Upload
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await adminClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = adminClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
