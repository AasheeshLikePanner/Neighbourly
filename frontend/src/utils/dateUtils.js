function formatTwitterDate(dateString) {
  const uploadDate = new Date(dateString);
  const now = new Date();

  const diffMilliseconds = now - uploadDate;
  const diffMinutes = Math.round(diffMilliseconds / (1000 * 60));
  const diffHours = Math.round(diffMilliseconds / (1000 * 60 * 60));
  const diffDays = Math.round(diffMilliseconds / (1000 * 60 * 60 * 24));

  // Less than an hour ago (show minutes)
  if (diffMinutes < 60) {
    if (diffMinutes <= 1) return '1m'; // "1m" for "just now" or 1 minute
    return `${diffMinutes}m`;
  }

  // Less than 24 hours ago (show hours)
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  // Same year (show month and day)
  if (uploadDate.getFullYear() === now.getFullYear()) {
    return uploadDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  }

  // Different year (show month, day, and year)
  return uploadDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default formatTwitterDate;