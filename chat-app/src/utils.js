// Deterministic user avatar color mapping
const USER_COLORS = {
  Alan: '#3b82f6',  // Blue
  Bob: '#10b981',   // Emerald
  Carol: '#f59e0b', // Amber
  Dean: '#8b5cf6',  // Purple
  Elin: '#ec4899',  // Pink
};

/**
 * Returns a stable theme color for a user.
 */
export function getUserColor(author) {
  return USER_COLORS[author] || '#0d9488';
}

/**
 * Formats a Date object or timestamp into a readable 12-hour time string.
 */
export function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
