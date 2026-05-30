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

export function createReservationFallback() {
  return {
    firstName: "Guest",
    lastName: "",
    phone: "",
    email: "",
    guests: "2",
    date: "Pending selection",
    selectedTime: "Pending selection",
    preferences: [],
    notes: "",
    confirmationNumber: "RCB-PENDING",
    status: "Pending host confirmation",
  };
}
