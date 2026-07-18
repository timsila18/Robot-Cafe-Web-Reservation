import { prisma } from "./_prisma.js";
import { ensureBranches } from "./_branches.js";

function parseReservationDate(value) {
  if (!value) return null;
  const parsed = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeStatus(value) {
  const map = {
    "Pending host confirmation": "PENDING",
    "Cancellation requested": "CANCELLATION_REQUESTED",
    "Modification requested": "MODIFICATION_REQUESTED",
    Confirmed: "CONFIRMED",
    Rejected: "REJECTED",
    Cancelled: "CANCELLED",
    Completed: "COMPLETED",
  };

  return map[value] || "PENDING";
}

function statusLabel(value) {
  const map = {
    PENDING: "Pending host confirmation",
    CONFIRMED: "Confirmed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
    CANCELLATION_REQUESTED: "Cancellation requested",
    MODIFICATION_REQUESTED: "Modification requested",
  };

  return map[value] || "Pending host confirmation";
}

function publicReservation(reservation) {
  if (!reservation) return null;

  return {
    confirmationNumber: reservation.confirmationNumber,
    status: statusLabel(reservation.status),
    statusCode: reservation.status,
    branchName: reservation.branch?.name,
    branch: reservation.branch,
    date: reservation.date,
    selectedTime: reservation.selectedTime,
    guests: reservation.guests,
    preferences: reservation.preferences || [],
    notes: reservation.notes || "",
    reservationInbox: reservation.routingInbox,
    customer: reservation.customer
      ? {
          firstName: reservation.customer.firstName,
          lastName: reservation.customer.lastName,
          email: reservation.customer.email,
          phone: reservation.customer.phone,
        }
      : null,
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt,
  };
}

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    if (req.method === "GET") {
      const confirmationNumber = String(req.query?.confirmationNumber || req.query?.confirmation || "").trim().toUpperCase();

      if (!confirmationNumber) {
        res.status(400).json({ error: "Confirmation number is required." });
        return;
      }

      const reservation = await prisma.reservation.findUnique({
        where: { confirmationNumber },
        include: { branch: true, customer: true },
      });

      if (!reservation) {
        res.status(404).json({ error: "Reservation not found. Please check the confirmation number." });
        return;
      }

      res.status(200).json({ reservation: publicReservation(reservation) });
      return;
    }

    let payload;
    try {
      payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    } catch {
      res.status(400).json({ error: "Invalid JSON request body." });
      return;
    }

    await ensureBranches(prisma);

    const branchId = payload.branchId || payload.branch?.id || "lana-plaza";
    const reservationDate = parseReservationDate(payload.date);

    if (!reservationDate) {
      res.status(400).json({ error: "Reservation date is required." });
      return;
    }

    if (!payload.firstName || !payload.lastName || !payload.phone || !payload.email) {
      res.status(400).json({ error: "Guest name, phone, and email are required." });
      return;
    }

    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) {
      res.status(400).json({ error: "Unknown Robot Cafe branch." });
      return;
    }

    const customer = await prisma.customer.upsert({
      where: {
        email_phone: {
          email: payload.email,
          phone: payload.phone,
        },
      },
      update: {
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
      create: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
      },
    });

    const reservation = await prisma.reservation.upsert({
      where: { confirmationNumber: payload.confirmationNumber },
      update: {
        branchId,
        customerId: customer.id,
        guests: Number(payload.guests || 1),
        date: reservationDate,
        selectedTime: payload.selectedTime,
        status: normalizeStatus(payload.status),
        preferences: payload.preferences || [],
        notes: payload.notes || null,
        routingInbox: branch.reservationInbox,
      },
      create: {
        confirmationNumber: payload.confirmationNumber,
        branchId,
        customerId: customer.id,
        guests: Number(payload.guests || 1),
        date: reservationDate,
        selectedTime: payload.selectedTime,
        status: normalizeStatus(payload.status),
        preferences: payload.preferences || [],
        notes: payload.notes || null,
        routingInbox: branch.reservationInbox,
      },
      include: {
        branch: true,
        customer: true,
      },
    });

    res.status(201).json({ reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to save reservation request." });
  }
}
