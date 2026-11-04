const BASE = import.meta.env.VITE_API_URL;
const token = () => localStorage.getItem('token');
const authHeader = () => (token() ? { Authorization: `Bearer ${token()}` } : {});

const waiting = new Map(); // "name|bytes" -> the File chosen in the browser
const keyOf = (name, bytes) => `${name}|${bytes}`;

export const rememberFile = (file) => waiting.set(keyOf(file.name, file.size), file);
export const forgetFile = (doc) => waiting.delete(keyOf(doc.n, doc.b));

async function upload(indentId, file) {
  const form = new FormData();
  form.append('indentId', indentId);
  form.append('file', file);
  // no Content-Type here: the browser sets it for a file upload
  const res = await fetch(`${BASE}/attachments`, { method: 'POST', headers: authHeader(), body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

// Upload every chosen file that is listed in `docs`. Returns the names that failed (empty list = all good).
export async function sendWaitingFiles(indentId, docs) {
  const failed = [];
  for (const d of docs || []) {
    const file = waiting.get(keyOf(d.n, d.b));
    if (!file) continue; // already uploaded, or a name-only entry
    try {
      await upload(indentId, file);
      waiting.delete(keyOf(d.n, d.b));
    } catch (err) {
      failed.push(d.n);
    }
  }
  return failed;
}

export async function listAttachments(indentId) {
  const res = await fetch(`${BASE}/attachments?indentId=${encodeURIComponent(indentId)}`, { headers: authHeader() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not load the files');
  return data;
}

// The download needs the login token, so a plain link will not work. We fetch the file and save it.
export async function downloadAttachment(att) {
  const res = await fetch(`${BASE}/attachments/${att.id}/download`, { headers: authHeader() });
  if (!res.ok) throw new Error('Could not download the file');
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement('a');
  a.href = url;
  a.download = att.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}