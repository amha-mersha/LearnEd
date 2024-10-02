// types/next-auth.d.ts
import NextAuth from "next-auth";

// Extend the default session interface
declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      role: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    accessToken: string;
    role: string;
  }
}
