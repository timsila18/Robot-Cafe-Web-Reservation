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
  return data.token;
}

export async function fetchSurveyDashboard(token) {
  const response = await fetch("/api/admin/surveys", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Unable to load survey dashboard.");
  return data;
}
