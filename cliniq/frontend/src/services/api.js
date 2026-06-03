const rawBackendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
function stripTrailingSlash(url) {
  return url ? url.replace(/\/+$/, "") : url;
}

const BASE = rawBackendUrl
  ? `${stripTrailingSlash(rawBackendUrl)}/api`
  : "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Non-JSON response received: ${text}`);
    }
  }

  if (!res.ok)
    throw new Error(
      (data && data.error) || `Request failed: ${res.status} ${res.statusText}`,
    );
  return data;
}

export const api = {
  getQueue: () => request("/queue"),
  addPatient: (patientName) =>
    request("/queue/add", {
      method: "POST",
      body: JSON.stringify({ patientName }),
    }),
  callNext: () => request("/queue/call-next", { method: "POST" }),
  completeConsultation: () => request("/queue/complete", { method: "POST" }),
  getSettings: () => request("/settings"),
  updateAvgMinutes: (minutes) =>
    request("/settings/avg-minutes", {
      method: "PATCH",
      body: JSON.stringify({ minutes }),
    }),
};
