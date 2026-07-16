import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Google sign-in. Credentials come from env (AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
// / AUTH_SECRET). If they aren't set yet the site still works — there are just
// no providers, so nobody can sign in (favorites stay device-local).
const configured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: configured ? [Google] : [],
  session: { strategy: "jwt" },
});
