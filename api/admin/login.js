import { findStaffCredential, hasStaffConfig, signStaffToken } from "../_adminAuth.js";

function parsePayload(req) {
  return typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!hasStaffConfig()) {
    res.status(503).json({ error: "Staff login is not configured yet." });
    return;
  }

  try {
    const payload = parsePayload(req);
    const email = String(payload.email || "").trim().toLowerCase();
    const password = String(payload.password || "");

    const staff = findStaffCredential(email, password);
    if (!staff) {
      res.status(401).json({ error: "Invalid staff login." });
      return;
    }

    res.status(200).json({ token: signStaffToken(staff), user: staff });
  } catch {
    res.status(400).json({ error: "Invalid JSON request body." });
  }
}
