function getInitials(user) {
  const name = user?.user_metadata?.full_name || user?.email || "";
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function UserAvatar({ user, size = 36 }) {
  const avatarUrl = user?.user_metadata?.avatar_url;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={user?.user_metadata?.full_name || "Profile"}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-[#991313] text-xs font-semibold text-white"
    >
      {getInitials(user)}
    </div>
  );
}

export default UserAvatar;