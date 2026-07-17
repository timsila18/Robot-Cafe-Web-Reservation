const defaultQrMenuApiBase = "https://robot-cafe-qr-web-reservation.vercel.app";
const branchSlugs = ["imaara-mall", "lana-plaza"];

function qrMenuApiBase() {
  return (process.env.QR_MENU_API_BASE || defaultQrMenuApiBase).replace(/\/+$/g, "");
}

function formatPrice(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return String(value || "");
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount).replace("Ksh", "KES");
}

function primaryImage(item) {
  const images = Array.isArray(item.images) ? item.images : [];
  const primary = images.find((image) => image.isPrimary) || images[0];
  return primary?.cardUrl || primary?.detailUrl || primary?.imageUrl || item.imageUrl || "";
}

function mapQrItem(item, categoriesById, branchSlug) {
  const category = categoriesById.get(item.categoryId);
  const categoryName = category?.name || "Menu";

  return {
    id: `${branchSlug}-${item.id || item.slug || item.name}`,
    sourceId: item.id,
    title: item.name,
    category: categoryName,
    price: formatPrice(item.price),
    description: item.shortDescription || item.description || "",
    tags: [
      item.isFeatured ? "featured" : "",
      item.isBestSeller ? "popular" : "",
      item.isNewArrival ? "new" : "",
      branchSlug,
    ].filter(Boolean),
    popular: Boolean(item.isBestSeller),
    featured: Boolean(item.isFeatured),
    signature: Boolean(item.isFeatured || item.isBestSeller),
    active: item.isActive !== false && item.isSoldOut !== true,
    soldOut: Boolean(item.isSoldOut),
    branchSlug,
    branchName: branchSlug === "imaara-mall" ? "Imaara Mall" : "Lana Plaza",
    imageUrl: primaryImage(item),
    media: { publicId: "", fallbackKey: "plates" },
  };
}

async function fetchBranchMenu(branchSlug) {
  const response = await fetch(`${qrMenuApiBase()}/api/menu/${branchSlug}`, {
    headers: { Accept: "application/json" },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.error || `Unable to load ${branchSlug} QR menu.`);
  }

  const data = payload.data || payload;
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const items = Array.isArray(data.items) ? data.items.map((item) => mapQrItem(item, categoriesById, branchSlug)) : [];

  return {
    categories: categories.map((category) => category.name).filter(Boolean),
    items,
  };
}

export async function getQrMenuContent() {
  const results = await Promise.allSettled(branchSlugs.map(fetchBranchMenu));
  const successful = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  if (!successful.length) {
    const reason = results.find((result) => result.status === "rejected")?.reason;
    throw reason instanceof Error ? reason : new Error("Unable to load Robot Cafe QR menu.");
  }

  const categories = Array.from(new Set(["All", ...successful.flatMap((entry) => entry.categories)]));
  const items = successful.flatMap((entry) => entry.items).filter((item) => item.active !== false);

  return {
    source: "robot-cafe-qr-platform",
    categories,
    items,
  };
}
