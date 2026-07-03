/**
 * Compress and resize an image on the client before uploading.
 * Converts to WebP for smallest file size.
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.75
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to compress image"));
            return;
          }

          // Create a new File with .webp extension
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".webp"),
            { type: "image/webp" }
          );

          resolve(compressedFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Upload an image with compression and old-image cleanup.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(
  file: File,
  folder: string,
  oldUrl?: string,
  maxWidth: number = 1200
): Promise<string> {
  // Compress the image first
  const compressed = await compressImage(file, maxWidth);

  const formData = new FormData();
  formData.append("file", compressed);
  formData.append("folder", folder);
  if (oldUrl) {
    formData.append("old_url", oldUrl);
  }

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Upload failed");
  }

  const data = await res.json();
  return data.url;
}
