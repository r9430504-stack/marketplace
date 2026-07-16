import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Google sign-in. Credentials come from env (AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
// / AUTH_SECRET). If they aren't set yet the site still works — there are just
// no providers, so nobody can sign in (favorites stay device-local).
const configured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

/** The site owner's email (moderator / admin). Set OWNER_EMAIL in the env. */
export function isOwnerEmail(email?: string | null): boolean {
  const owner = (process.env.OWNER_EMAIL || "").toLowerCase();
  return !!owner && !!email && email.toLowerCase() === owner;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: configured ? [Google] : [],
  session: { strategy: "jwt" },
  callbacks: {
    // Expose an `isOwner` flag on the session so the UI can show owner-only
    // controls. Authorization is still enforced server-side on every request.
    session({ session }) {
      if (session.user) {
        (session.user as { isOwner?: boolean }).isOwner = isOwnerEmail(session.user.email);
      }
      return session;
    },
  },
});
