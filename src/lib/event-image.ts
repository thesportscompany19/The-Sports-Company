const MAX_EVENT_IMAGE_BYTES = 2 * 1024 * 1024;
const EVENT_IMAGE_PATTERN = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/;

export function isValidEventImage(image: unknown): image is string {
  if (typeof image !== "string") return false;
  if (image.startsWith("/")) return true;
  if (image.length > 2_800_000) return false;

  const match = EVENT_IMAGE_PATTERN.exec(image);
  if (!match) return false;
  return Buffer.from(match[2], "base64").byteLength <= MAX_EVENT_IMAGE_BYTES;
}

export function decodeEventImage(image: string) {
  const match = EVENT_IMAGE_PATTERN.exec(image);
  if (!match) return null;
  return {
    contentType: match[1] as "image/png" | "image/jpeg" | "image/webp",
    data: Buffer.from(match[2], "base64"),
  };
}
