import { prisma } from "./_prisma.js";

const branchSeeds = [
  {
    id: "lana-plaza",
    name: "Robot Cafe - Lana Plaza",
    shortName: "Lana Plaza",
    address: "Lana Plaza, Oloitoktok Rd, Nairobi",
    reservationInbox: "reservations@robotcafe.co.ke",
    reservationRoutingLabel: "Lana Plaza reservation desk",
    diaryPlaceName: "Robot Cafe - Lana Plaza",
  },
  {
    id: "imaara-mall",
    name: "Robot Cafe - Imaara Mall",
    shortName: "Imaara Mall",
    address: "Ground Floor, Imaara Mall along Mombasa Road",
    reservationInbox: "imaara.reservations@robotcafe.co.ke",
    reservationRoutingLabel: "Imaara Mall reservation desk",
    diaryPlaceName: "Robot Cafe - Imaara Mall",
  },
];

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
  };

  return map[value] || "PENDING";
}

async function ensureBranches() {
  await Promise.all(
    branchSeeds.map((branch) =>
      prisma.branch.upsert({
        where: { id: branch.id },
        update: branch,
        create: branch,
      })
    )
  );
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
      payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    } catch {
      res.status(400).json({ error: "Invalid JSON request body." });
      return;
    }

    await ensureBranches();

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
