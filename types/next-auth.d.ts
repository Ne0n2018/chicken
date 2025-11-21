// types/next-auth.d.ts
import { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "PARENT" | "TEACHER" | "CHILD";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "PARENT" | "TEACHER" | "CHILD";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "PARENT" | "TEACHER" | "CHILD";
  }
}
