// Простая обёртка для fetch, подставляет Authorization из localStorage
export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('token') || '';
  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(path, Object.assign({}, opts, { headers }));
  if (!res.ok) {
    const text = await res.text();
    let err;
    try { err = JSON.parse(text); } catch(e) { err = { message: text }; }
    const error = new Error(err.error || err.message || res.statusText);
    error.status = res.status;
    error.body = err;
    throw error;
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}
