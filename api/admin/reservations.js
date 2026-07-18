import { verifyReservationStaffToken } from "../_adminAuth.js";
import { ensureBranches } from "../_branches.js";
import { prisma } from "../_prisma.js";

const editableStatuses = new Set(["PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED", "CANCELLATION_REQUESTED", "MODIFICATION_REQUESTED"]);

function parsePayload(req) {
  return typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
}

function requireStaff(req, res) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const staff = verifyReservationStaffToken(token);
  if (!staff) {
    res.status(401).json({ error: "Staff authorization required." });
    return null;
  }
  return staff;
}

function branchWhereFor(staff) {
  if (staff.role === "admin") return {};
  return { branchId: staff.branchId };
}

export default async function handler(req, res) {
  if (!["GET", "PATCH"].includes(req.method)) {
    res.setHeader("Allow", "GET, PATCH");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const staff = requireStaff(req, res);
  if (!staff) return;

  try {
    await ensureBranches(prisma);

    if (req.method === "GET") {
      const reservations = await prisma.reservation.findMany({
        where: branchWhereFor(staff),
        include: { branch: true, customer: true },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        take: 200,
      });

      res.status(200).json({ reservations, staff });
      return;
    }

    const payload = parsePayload(req);
    const reservationId = String(payload.reservationId || "");
    const status = String(payload.status || "").toUpperCase();

    if (!reservationId || !editableStatuses.has(status)) {
      res.status(400).json({ error: "Reservation ID and a valid status are required." });
      return;
    }

    const existing = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { branch: true, customer: true },
    });

    if (!existing) {
      res.status(404).json({ error: "Reservation not found." });
      return;
    }

    if (staff.role !== "admin" && existing.branchId !== staff.branchId) {
      res.status(403).json({ error: "This hostess account can only process its assigned branch reservations." });
      return;
    }

    const reservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status,
        notes: payload.notes === undefined ? existing.notes : String(payload.notes || "").trim() || null,
      },
      include: { branch: true, customer: true },
    });

    res.status(200).json({ reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load or update reservations. Check the Supabase database connection." });
  }
}
