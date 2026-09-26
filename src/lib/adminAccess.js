//Run the below SQL commands in the Supabase SQL editor to restrict forum post creation to admins only. You can add/remove emails from the list as needed.
/*
drop policy if exists "Only admins can create posts" on forum_posts;

create policy "Only admins can create posts"
on forum_posts for insert
with check (
  auth.jwt() ->> 'email' in (
    'example.admin1@machaira.org',
    'example.admin2@machaira.org',
    'new.person@machaira.org'
  )
);
*/
export const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

// Case-insensitive check against the logged-in user's email.
// `user` is the Supabase auth user object (or null/undefined if logged out).
export function isAdmin(user) {
  if (!user?.email) return false;
  const email = user.email.toLowerCase();
  return ADMIN_EMAILS.some((allowed) => allowed.toLowerCase() === email);
}