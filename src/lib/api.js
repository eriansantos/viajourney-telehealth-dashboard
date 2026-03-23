const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function apiGet(path, getToken, params = {}) {
  const token = await getToken();

  const url = new URL(`${API_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }

  return res.json();
}
