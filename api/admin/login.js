import { hasAdminConfig, isAdminCredential, signAdminToken } from "../_adminAuth.js";

function parsePayload(req) {
  return typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!hasAdminConfig()) {
    res.status(503).json({ error: "Admin login is not configured yet." });
    return;
  }

  try {
    const payload = parsePayload(req);
    const email = String(payload.email || "").trim().toLowerCase();
    const password = String(payload.password || "");

    if (!isAdminCredential(email, password)) {
      res.status(401).json({ error: "Invalid admin login." });
      return;
    }

    res.status(200).json({ token: signAdminToken(email) });
  } catch {
    res.status(400).json({ error: "Invalid JSON request body." });
  }
}
