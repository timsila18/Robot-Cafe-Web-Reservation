import { prisma } from "./_prisma.js";
import { ensureBranches } from "./_branches.js";

const ratingFields = [
  "priceRating",
  "waiterServiceRating",
  "robotExperienceRating",
  "ambienceRating",
  "foodFlavorRating",
  "foodValueRating",
  "foodPortionRating",
  "overallRating",
];

const tagFields = [
  "priceTags",
  "waiterServiceTags",
  "robotExperienceTags",
  "ambienceTags",
  "foodFlavorTags",
  "foodValueTags",
  "foodPortionTags",
];

function parsePayload(req) {
  return typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
}

function toRating(value) {
  const rating = Number(value);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null;
}

function toTags(value) {
  if (!Array.isArray(value)) return [];
  return value.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 5);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    let payload;
    try {
      payload = parsePayload(req);
    } catch {
      res.status(400).json({ error: "Invalid JSON request body." });
      return;
    }

    await ensureBranches(prisma);

    const branchId = payload.branchId || "imaara-mall";
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });

    if (!branch) {
      res.status(400).json({ error: "Please choose a valid Robot Cafe branch." });
      return;
    }

    const ratings = {};
    for (const field of ratingFields) {
      const rating = toRating(payload[field]);
      if (!rating) {
        res.status(400).json({ error: "Please complete all survey ratings." });
        return;
      }
      ratings[field] = rating;
    }

    const tags = {};
    for (const field of tagFields) {
      tags[field] = toTags(payload[field]);
    }

    const survey = await prisma.surveyResponse.create({
      data: {
        branchId,
        tableCode: payload.tableCode ? String(payload.tableCode).trim().slice(0, 40) : null,
        source: payload.source ? String(payload.source).trim().slice(0, 40) : "qr",
        ...ratings,
        ...tags,
        comment: payload.comment ? String(payload.comment).trim().slice(0, 600) : null,
      },
      include: { branch: true },
    });

    res.status(201).json({ survey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to save survey response." });
  }
}
