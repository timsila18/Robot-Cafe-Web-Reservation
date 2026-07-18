import galleryContent from "../data/cms/gallery.json";
import menuContent from "../data/cms/menu.json";
import mediaCategoriesContent from "../data/cms/media-categories.json";
import promotionsContent from "../data/cms/promotions.json";
import eventsContent from "../data/cms/events.json";
import { mediaConfig } from "../config/media";
import { mediaFromRecord } from "./mediaService";

const today = new Date();

function parseDate(value) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function isInDateRange(item, referenceDate = today) {
  const start = parseDate(item.startDate);
  const end = parseDate(item.endDate);

  if (start && referenceDate < start) return false;
  if (end && referenceDate > end) return false;
  return true;
}

function withImage(record, mediaKey = "media", transform = "card") {
  const media = record[mediaKey] || record.media || record.banner;
  if (record.imageUrl) {
    return {
      ...record,
      image: record.imageUrl,
      src: record.imageUrl,
    };
  }

  return {
    ...record,
    image: mediaFromRecord(media, media?.fallbackKey || "plates", transform),
    src: mediaFromRecord(media, media?.fallbackKey || "plates", transform),
  };
}

function byTitle(a, b) {
  return a.title.localeCompare(b.title);
}

function hasUploadedMedia(record, mediaKey = "media") {
  const media = record[mediaKey] || record.media || record.banner;
  return Boolean(record.imageUrl || (mediaConfig.cloudinaryBase && media?.publicId));
}

function menuItemAsGalleryImage(item) {
  return {
    id: `menu-gallery-${item.id}`,
    title: item.title,
    category: item.category || "Food",
    featured: Boolean(item.featured || item.signature || item.popular),
    src: item.imageUrl || item.image || item.src,
    image: item.imageUrl || item.image || item.src,
    source: "menu",
  };
}

function featuredFirst(items, limit) {
  const featured = items.filter((item) => item.featured);
  const regular = items.filter((item) => !item.featured);
  return [...featured, ...regular].slice(0, limit);
}

export function getMediaCategories() {
  return mediaCategoriesContent.categories;
}

export function getMenuCategories() {
  return menuContent.categories;
}

export function getMenuItems() {
  return menuContent.items.filter((item) => item.active !== false).map((item) => withImage(item, "media")).sort(byTitle);
}

export function normalizeMenuContent(content = menuContent) {
  const categories = Array.isArray(content.categories) && content.categories.length ? content.categories : menuContent.categories;
  const items = Array.isArray(content.items) ? content.items : menuContent.items;
  return {
    ...content,
    categories,
    items: items.filter((item) => item.active !== false).map((item) => withImage(item, "media")).sort(byTitle),
  };
}

export function getFeaturedDishes() {
  return getMenuItems().filter((item) => item.featured);
}

export function getPopularDishes() {
  return getMenuItems().filter((item) => item.popular);
}

export function getSignatureDishes() {
  return getMenuItems().filter((item) => item.signature);
}

export function getSeasonalMenus() {
  return (menuContent.seasonalMenus || []).filter((menu) => menu.active !== false).map((menu) => withImage(menu, "banner", "banner"));
}

export function getPromotionCategories() {
  const categories = promotionsContent.promotions.map((promotion) => promotion.category);
  return ["All", ...Array.from(new Set(categories))];
}

export function getPromotions() {
  return promotionsContent.promotions.map((promotion) => ({
    ...withImage(promotion, "banner", "banner"),
    isCurrent: promotion.active !== false && isInDateRange(promotion),
    isUpcoming: promotion.active !== false && parseDate(promotion.startDate) > today,
    expiresLabel: promotion.endDate ? `Valid till ${new Intl.DateTimeFormat("en-KE", { dateStyle: "medium" }).format(parseDate(promotion.endDate))}` : "Ongoing",
  }));
}

export function getActivePromotions() {
  return getPromotions().filter((promotion) => promotion.isCurrent);
}

export function getFeaturedPromotions() {
  const featuredCurrent = getActivePromotions().filter((promotion) => promotion.featured);
  return featuredCurrent.length ? featuredCurrent : getPromotions().filter((promotion) => promotion.featured && promotion.active !== false);
}

export function getGalleryCategories() {
  return galleryContent.categories;
}

export function getGalleryItems() {
  return galleryContent.images.map((image) => withImage(image, "media"));
}

export function getUploadedGalleryItems() {
  return galleryContent.images.filter((image) => hasUploadedMedia(image, "media")).map((image) => withImage(image, "media"));
}

export function getFeaturedGalleryItems() {
  const featured = getGalleryItems().filter((image) => image.featured);
  return featured.length ? featured : getGalleryItems().slice(0, 6);
}

export function getGalleryItemsWithMenuFallback(menuItems = [], limit = 6) {
  const uploadedGallery = getUploadedGalleryItems();
  if (uploadedGallery.length) {
    return featuredFirst(uploadedGallery, limit);
  }

  const menuPhotos = menuItems
    .filter((item) => item.imageUrl || item.image || item.src)
    .map(menuItemAsGalleryImage);
  return featuredFirst(menuPhotos, limit);
}

export function getEvents() {
  return eventsContent.events.filter((event) => event.active !== false).map((event) => withImage(event, "media"));
}
