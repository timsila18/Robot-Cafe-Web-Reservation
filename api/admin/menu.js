import { getCmsContent, saveCmsContent } from "../_cms.js";
import { verifyAdminToken } from "../_adminAuth.js";
import { defaultMenuContent } from "../_defaultMenu.js";

function parsePayload(req) {
  return typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
}

function normalizeItem(item, index) {
  const title = String(item.title || "").trim();
  const category = String(item.category || "").trim();
  const price = String(item.price || "").trim();
  if (!title || !category || !price) return null;

  const id =
    String(item.id || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `menu-item-${index + 1}`;

  return {
    id,
    title,
    category,
    price,
    description: String(item.description || "").trim(),
    tags: Array.isArray(item.tags) ? item.tags.map(String).filter(Boolean) : [],
    popular: Boolean(item.popular),
    featured: Boolean(item.featured),
    signature: Boolean(item.signature),
    active: item.active !== false,
    media: item.media || { publicId: "", fallbackKey: "plates" },
  };
}

function normalizeContent(payload) {
  const categories = Array.isArray(payload.categories)
    ? payload.categories.map((category) => String(category).trim()).filter(Boolean)
    : defaultMenuContent.categories;

  const uniqueCategories = Array.from(new Set(["All", ...categories.filter((category) => category !== "All")]));
  const items = Array.isArray(payload.items) ? payload.items.map(normalizeItem).filter(Boolean) : [];

  if (!items.length) {
    throw new Error("Add at least one active menu item before saving.");
  }

  return {
    categories: uniqueCategories,
    seasonalMenus: Array.isArray(payload.seasonalMenus) ? payload.seasonalMenus : [],
    items,
  };
}

function requireAdmin(req, res) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: "Admin authorization required." });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (!["GET", "PUT"].includes(req.method)) {
    res.setHeader("Allow", "GET, PUT");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === "GET") {
      const content = await getCmsContent("menu");
      res.status(200).json(content || defaultMenuContent);
      return;
    }

    const payload = parsePayload(req);
    const content = normalizeContent(payload);
    const saved = await saveCmsContent("menu", content);
    res.status(200).json(saved);
  } catch (error) {
    console.error(error);
    if (req.method === "GET") {
      res.status(200).json(defaultMenuContent);
      return;
    }
    res.status(400).json({ error: error.message || "Unable to save menu content." });
  }
}
