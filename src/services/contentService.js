import galleryContent from "../data/cms/gallery.json";
import menuContent from "../data/cms/menu.json";
import mediaCategoriesContent from "../data/cms/media-categories.json";
import promotionsContent from "../data/cms/promotions.json";
import eventsContent from "../data/cms/events.json";
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
  return {
    ...record,
    image: mediaFromRecord(media, media?.fallbackKey || "plates", transform),
    src: mediaFromRecord(media, media?.fallbackKey || "plates", transform),
  };
}

function byTitle(a, b) {
  return a.title.localeCompare(b.title);
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

export function getFeaturedGalleryItems() {
  const featured = getGalleryItems().filter((image) => image.featured);
  return featured.length ? featured : getGalleryItems().slice(0, 6);
}

export function getEvents() {
  return eventsContent.events.filter((event) => event.active !== false).map((event) => withImage(event, "media"));
}
