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
