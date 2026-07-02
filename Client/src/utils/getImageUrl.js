const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
}
