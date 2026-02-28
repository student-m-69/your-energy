const API_BASE = 'https://your-energy.b.goit.study/api';

async function request(path, config = {}) {
  const response = await fetch(`${API_BASE}${path}`, config);
  if (!response.ok) {
    let payload;
    try {
      payload = await response.json();
    } catch {}
    const error = new Error(payload?.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export function fetchDailyQuote() {
  return request('/quote');
}

export function fetchCategories(filter, page = 1, limit = 12) {
  const qs = new URLSearchParams({ filter, page, limit });
  return request(`/filters?${qs}`);
}

export function fetchWorkouts(params = {}) {
  const qs = new URLSearchParams(params);
  return request(`/exercises?${qs}`);
}

export function fetchWorkoutById(id) {
  return request(`/exercises/${id}`);
}

export function submitRating(id, data) {
  return request(`/exercises/${id}/rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function subscribeEmail(email) {
  return request('/subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}
