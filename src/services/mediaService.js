import { mediaConfig } from "../config/media";

export function getMedia(publicId, fallbackKey, transform = "card") {
  if (mediaConfig.cloudinaryBase && publicId) {
    const transformString = mediaConfig.transforms[transform] || mediaConfig.transforms.card;
    return `${mediaConfig.cloudinaryBase}/${transformString}/${publicId}`;
  }

  return mediaConfig.fallbackImages[fallbackKey];
}

export function mediaFromRecord(record, fallbackKey = "plates", transform = "card") {
  return getMedia(record?.publicId, record?.fallbackKey || fallbackKey, record?.transform || transform);
}
