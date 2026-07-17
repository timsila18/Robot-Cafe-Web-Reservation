import { createHmac, timingSafeEqual } from "node:crypto";

const encoder = new TextEncoder();

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function readSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.STAFF_SESSION_SECRET || process.env.ADMIN_PASSWORD;
}

export function hasAdminConfig() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && readSecret());
}

export function hasStaffConfig() {
  return Boolean(readSecret() && getStaffAccounts().some((account) => account.email && account.password));
}

export function getStaffAccounts() {
  return [
    {
      id: "admin",
      name: "Robot Cafe Administrator",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      branchId: null,
      branchName: "All branches",
      permissions: ["menu:manage", "reservations:manage", "surveys:view", "users:manage", "branches:manage"],
    },
    {
      id: "lana-hostess",
      name: "Lana Plaza Hostess",
      email: process.env.HOSTESS_LANA_EMAIL || "lana@robotcafe.co.ke",
      password: process.env.HOSTESS_LANA_PASSWORD,
      role: "hostess",
      branchId: "lana-plaza",
      branchName: "Lana Plaza",
      permissions: ["reservations:manage"],
    },
    {
      id: "imaara-hostess",
      name: "Imaara Mall Hostess",
      email: process.env.HOSTESS_IMAARA_EMAIL || "imaara@robotcafe.co.ke",
      password: process.env.HOSTESS_IMAARA_PASSWORD,
      role: "hostess",
      branchId: "imaara-mall",
      branchName: "Imaara Mall",
      permissions: ["reservations:manage"],
    },
  ].filter((account) => account.email && account.password);
}

function publicStaff(account) {
  if (!account) return null;
  const { password, ...safeAccount } = account;
  return safeAccount;
}

export function isAdminCredential(email, password) {
  return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
}

export function findStaffCredential(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const account = getStaffAccounts().find((staff) => staff.email.toLowerCase() === normalizedEmail && staff.password === password);
  return publicStaff(account);
}

export function signStaffToken(account) {
  const payload = base64url(
    JSON.stringify({
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      branchId: account.branchId,
      branchName: account.branchName,
      permissions: account.permissions || [],
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
    })
  );
  return `${payload}.${sign(payload, readSecret())}`;
}

export function signAdminToken(email) {
  return signStaffToken({
    id: "admin",
    name: "Robot Cafe Administrator",
    email,
    role: "admin",
    branchId: null,
    branchName: "All branches",
    permissions: ["menu:manage", "reservations:manage", "surveys:view", "users:manage", "branches:manage"],
  });
}

export function verifyStaffToken(token) {
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
    return decoded;
  } catch {
    return null;
  }
}

export function verifyAdminToken(token) {
  const decoded = verifyStaffToken(token);
  if (!decoded || decoded.role !== "admin") return null;
  return decoded;
}

export function verifyReservationStaffToken(token) {
  const decoded = verifyStaffToken(token);
  if (!decoded) return null;
  if (decoded.role === "admin") return decoded;
  if (decoded.role === "hostess" && decoded.permissions?.includes("reservations:manage")) return decoded;
  return null;
}
