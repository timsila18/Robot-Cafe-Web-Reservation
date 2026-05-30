import { getFeaturedPromotions } from "../services/contentService";

export const offers = getFeaturedPromotions().map((promotion) => ({
  ...promotion,
  price: promotion.badge,
  cta: promotion.cta?.label || "View Offer",
  href: promotion.cta?.href || "/offers",
}));
