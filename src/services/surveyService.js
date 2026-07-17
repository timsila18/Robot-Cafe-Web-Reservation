export async function submitSurveyResponse(payload) {
  const response = await fetch("/api/surveys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Unable to submit survey.");
  return data.survey;
}

export async function adminLogin(email, password) {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Unable to sign in.");
  return data;
}

export async function fetchSurveyDashboard(token) {
  const response = await fetch("/api/admin/surveys", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Unable to load survey dashboard.");
  return data;
}

export async function fetchAdminMenu(token) {
  const response = await fetch("/api/admin/menu", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Unable to load menu content.");
  return data;
}

export async function saveAdminMenu(token, payload) {
  const response = await fetch("/api/admin/menu", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Unable to save menu content.");
  return data;
}

export async function fetchAdminReservations(token) {
  const response = await fetch("/api/admin/reservations", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Unable to load reservations.");
  return data;
}

export async function updateReservationStatus(token, reservationId, status, notes) {
  const response = await fetch("/api/admin/reservations", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reservationId, status, notes }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Unable to update reservation.");
  return data.reservation;
}
