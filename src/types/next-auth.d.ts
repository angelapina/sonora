import type { DefaultSession } from "next-auth";

export type UserRole = "CLIENT" | "MUSICIAN" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      musicianSlug?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    musicianSlug?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    musicianSlug?: string | null;
  }
}
