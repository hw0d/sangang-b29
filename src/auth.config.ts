import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no Node-only imports (Prisma, bcrypt) so this can be
// used directly by middleware, which runs on the Edge runtime. The
// Credentials provider (which needs Prisma/bcrypt) is added on top of this
// in auth.ts, which only ever runs in the Node runtime (route handlers,
// server actions).
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/admin/login";
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute && !isLoginPage) {
        return isLoggedIn;
      }
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as "ADMIN" | "EDITOR";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
