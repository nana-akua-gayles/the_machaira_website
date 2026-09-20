export function formatDevotionalTitle(title) {
  if (!title) {
    return {
      mainTitle: "Devotional",
      episodeLabel: "",
    };
  }

  const match = title.match(/^EPISODE\s+(\d+)\s*-\s*(.+)$/i);

  if (match) {
    return {
      mainTitle: match[2].trim(),
      episodeLabel: `Episode ${match[1]}`,
    };
  }

  return {
    mainTitle: title,
    episodeLabel: "",
  };
}

export function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Accra",
  });
}