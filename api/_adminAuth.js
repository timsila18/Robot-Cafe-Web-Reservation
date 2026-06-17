import { createHmac, timingSafeEqual } from "node:crypto";

const encoder = new TextEncoder();

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function readSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
}

export function hasAdminConfig() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && readSecret());
}

export function isAdminCredential(email, password) {
  return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
}

export function signAdminToken(email) {
  const payload = base64url(
    JSON.stringify({
      email,
      role: "robot-cafe-admin",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
    })
  );
  return `${payload}.${sign(payload, readSecret())}`;
}

export function verifyAdminToken(token) {
  if (!token || !readSecret()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload, readSecret());
  const signatureBytes = encoder.encode(signature);
  const expectedBytes = encoder.encode(expected);
  if (signatureBytes.byteLength !== expectedBytes.byteLength) return null;
  if (!timingSafeEqual(signatureBytes, expectedBytes)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;
    if (decoded.role !== "robot-cafe-admin") return null;
    return decoded;
  } catch {
    return null;
  }
}
