const MAX_COACH_GALLERY_IMAGE_BYTES = 2 * 1024 * 1024;
export const MAX_COACH_GALLERY_IMAGES = 10;
export const MAX_COACH_GALLERY_UPLOAD_BYTES = 12 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
export type CoachGalleryImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export function isCoachGalleryImageType(value: string): value is CoachGalleryImageType {
  return ALLOWED_IMAGE_TYPES.includes(value as CoachGalleryImageType);
}

export function isValidCoachGalleryImage(data: Buffer, contentType: string) {
  if (data.length === 0 || data.length > MAX_COACH_GALLERY_IMAGE_BYTES) return false;

  if (contentType === "image/png") {
    return data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (contentType === "image/jpeg") {
    return data.length >= 4 && data[0] === 0xff && data[1] === 0xd8 && data[data.length - 2] === 0xff && data[data.length - 1] === 0xd9;
  }
  if (contentType === "image/webp") {
    return data.length >= 12 && data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP";
  }
  return false;
}
