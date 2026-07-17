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

function branchName(branchSlug) {
  return branchSlug === "imaara-mall" ? "Imaara Mall" : "Lana Plaza";
}

function itemIdentity(item) {
  return [
    item.title,
    item.category,
    item.price,
  ]
    .map((part) =>
      String(part || "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
    )
    .join("|");
}

function mapQrItem(item, categoriesById, branchSlug) {
  const category = categoriesById.get(item.categoryId);
  const categoryName = category?.name || "Menu";

  return {
    id: item.id || item.slug || item.name,
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
    branchName: branchName(branchSlug),
    availableBranches: [branchSlug],
    availableBranchNames: [branchName(branchSlug)],
    availableLabel: `Available in ${branchName(branchSlug)}`,
    imageUrl: primaryImage(item),
    media: { publicId: "", fallbackKey: "plates" },
  };
}

function mergeDuplicateItems(items) {
  const merged = new Map();

  for (const item of items) {
    const key = itemIdentity(item);
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, {
        ...item,
        id: key,
      });
      continue;
    }

    const availableBranches = Array.from(new Set([...(existing.availableBranches || []), ...(item.availableBranches || [])]));
    const availableBranchNames = Array.from(new Set([...(existing.availableBranchNames || []), ...(item.availableBranchNames || [])]));

    merged.set(key, {
      ...existing,
      popular: existing.popular || item.popular,
      featured: existing.featured || item.featured,
      signature: existing.signature || item.signature,
      tags: Array.from(new Set([...(existing.tags || []), ...(item.tags || [])])),
      imageUrl: existing.imageUrl || item.imageUrl,
      availableBranches,
      availableBranchNames,
      branchSlug: availableBranches.join(","),
      branchName: availableBranchNames.join(" + "),
      availableLabel:
        availableBranchNames.length > 1
          ? `Available in ${availableBranchNames.slice(0, -1).join(", ")} and ${availableBranchNames.slice(-1)}`
          : `Available in ${availableBranchNames[0]}`,
    });
  }

  return Array.from(merged.values()).sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
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
  const items = mergeDuplicateItems(successful.flatMap((entry) => entry.items).filter((item) => item.active !== false));

  return {
    source: "robot-cafe-qr-platform",
    categories,
    items,
  };
}
