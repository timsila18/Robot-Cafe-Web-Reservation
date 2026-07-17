export async function persistReservationRequest(reservation) {
  const response = await fetch("/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reservation),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Unable to save reservation request.");
  }

  return response.json();
}

export async function fetchReservationStatus(confirmationNumber) {
  const query = encodeURIComponent(String(confirmationNumber || "").trim().toUpperCase());
  const response = await fetch(`/api/reservations?confirmationNumber=${query}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Unable to check reservation status.");
  }

  return data.reservation;
}
