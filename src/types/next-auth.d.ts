import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "EDITOR";
      position?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "EDITOR";
    position?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "EDITOR";
    position?: string | null;
  }
}
