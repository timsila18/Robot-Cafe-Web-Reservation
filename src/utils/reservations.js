export function getLatestReservation() {
  try {
    const stored = localStorage.getItem("robotCafeLatestReservation");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveLatestReservation(reservation) {
  localStorage.setItem("robotCafeLatestReservation", JSON.stringify(reservation));
}

export function saveReservationRequest(reservation) {
  saveLatestReservation(reservation);

  try {
    const stored = localStorage.getItem("robotCafeReservationRequests");
    const requests = stored ? JSON.parse(stored) : [];
    localStorage.setItem("robotCafeReservationRequests", JSON.stringify([reservation, ...requests]));

    const branchKey = reservation.branch?.id || reservation.branchId || "lana-plaza";
    const branchStorageKey = `robotCafeReservationRequests:${branchKey}`;
    const branchStored = localStorage.getItem(branchStorageKey);
    const branchRequests = branchStored ? JSON.parse(branchStored) : [];
    localStorage.setItem(branchStorageKey, JSON.stringify([reservation, ...branchRequests]));
  } catch {
    saveLatestReservation(reservation);
  }
}

export function createReservationFallback() {
  return {
    firstName: "Guest",
    lastName: "",
    phone: "",
    email: "",
    guests: "2",
    branch: {
      id: "lana-plaza",
      name: "Robot Cafe - Lana Plaza",
      shortName: "Lana Plaza",
      address: "Lana Plaza, Oloitoktok Rd, Nairobi",
    },
    branchName: "Robot Cafe - Lana Plaza",
    branchAddress: "Lana Plaza, Oloitoktok Rd, Nairobi",
    reservationInbox: "reservation@robotcafe.co.ke",
    reservationRoutingLabel: "Lana Plaza reservation desk",
    date: "Pending selection",
    selectedTime: "Pending selection",
    preferences: [],
    notes: "",
    confirmationNumber: "RC-PENDING",
    status: "Pending host confirmation",
  };
}
