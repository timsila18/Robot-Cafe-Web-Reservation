import { prisma } from "../_prisma.js";
import { verifyAdminToken } from "../_adminAuth.js";

const metricLabels = {
  priceRating: "Prices",
  waiterServiceRating: "Waiter customer service",
  robotExperienceRating: "Robot Elixer and approach",
  ambienceRating: "Ambience",
  foodFlavorRating: "Food flavor",
  foodValueRating: "Food value",
  foodPortionRating: "Food portions",
  overallRating: "Overall experience",
};

const metricFields = Object.keys(metricLabels);
const tagFields = [
  "priceTags",
  "waiterServiceTags",
  "robotExperienceTags",
  "ambienceTags",
  "foodFlavorTags",
  "foodValueTags",
  "foodPortionTags",
];

function average(values) {
  if (!values.length) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function countTags(responses) {
  const counts = {};
  for (const response of responses) {
    for (const field of tagFields) {
      for (const tag of response[field] || []) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
  }
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

function buildSummary(responses) {
  const metricAverages = metricFields.map((field) => ({
    field,
    label: metricLabels[field],
    value: average(responses.map((response) => response[field])),
  }));

  const byBranch = responses.reduce((acc, response) => {
    const key = response.branchId;
    if (!acc[key]) {
      acc[key] = {
        branchId: key,
        branchName: response.branch?.name || key,
        count: 0,
        overall: [],
      };
    }
    acc[key].count += 1;
    acc[key].overall.push(response.overallRating);
    return acc;
  }, {});

  return {
    totalResponses: responses.length,
    overallAverage: average(responses.map((response) => response.overallRating)),
    metricAverages,
    branchSummary: Object.values(byBranch).map((branch) => ({
      ...branch,
      overallAverage: average(branch.overall),
      overall: undefined,
    })),
    topTags: countTags(responses),
  };
}

function getMetric(summary, field) {
  return summary.metricAverages.find((metric) => metric.field === field)?.value || 0;
}

function buildRecommendations(summary) {
  if (!summary.totalResponses) {
    return [
      {
        title: "Start collecting QR responses",
        action: "Place the survey QR on every table and ask hosts to invite guests to scan after payment.",
        priority: "high",
      },
    ];
  }

  const recommendations = [];
  const portions = getMetric(summary, "foodPortionRating");
  const service = getMetric(summary, "waiterServiceRating");
  const robot = getMetric(summary, "robotExperienceRating");
  const price = getMetric(summary, "priceRating");
  const flavor = getMetric(summary, "foodFlavorRating");
  const ambience = getMetric(summary, "ambienceRating");

  if (portions && portions < 3.8) {
    recommendations.push({
      title: "Review portion perception this week",
      action: "Audit the top-selling dishes and add a visible value cue for portions, sides, or sharing options.",
      priority: "high",
    });
  }

  if (service && service < 4) {
    recommendations.push({
      title: "Refresh service touchpoints",
      action: "Run a short pre-shift standard on greetings, table checks, and closing remarks for waiters.",
      priority: "high",
    });
  }

  if (price && price < 3.7 && flavor >= 4) {
    recommendations.push({
      title: "Make value more visible",
      action: "Use combo offers, lunch bundles, and menu notes to connect premium ingredients with price.",
      priority: "medium",
    });
  }

  if (robot >= 4.3) {
    recommendations.push({
      title: "Turn Robot Elixer into a signature moment",
      action: "Invite guests to capture the robot interaction and feature it in social campaigns for Imaara Mall.",
      priority: "growth",
    });
  }

  if (ambience >= 4.3) {
    recommendations.push({
      title: "Use ambience as a conversion asset",
      action: "Post evening dining clips and QR survey quotes to reinforce the premium in-branch feeling.",
      priority: "growth",
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      title: "Maintain the current experience",
      action: "Ratings are balanced. Keep collecting responses and review branch summaries every Monday.",
      priority: "medium",
    });
  }

  return recommendations;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: "Admin authorization required." });
    return;
  }

  try {
    const responses = await prisma.surveyResponse.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      include: { branch: true },
    });

    const summary = buildSummary(responses);
    res.status(200).json({
      summary,
      recommendations: buildRecommendations(summary),
      responses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load survey dashboard." });
  }
}
