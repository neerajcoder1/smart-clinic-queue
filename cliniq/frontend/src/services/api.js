const BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  getQueue: () => request('/queue'),
  addPatient: (patientName) =>
    request('/queue/add', { method: 'POST', body: JSON.stringify({ patientName }) }),
  callNext: () => request('/queue/call-next', { method: 'POST' }),
  completeConsultation: () => request('/queue/complete', { method: 'POST' }),
  getSettings: () => request('/settings'),
  updateAvgMinutes: (minutes) =>
    request('/settings/avg-minutes', { method: 'PATCH', body: JSON.stringify({ minutes }) }),
};
