import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";
import { signOut } from "next-auth/react";
import { Role } from "@prisma/client";

import "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    userId: UserId;
    role: Role;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      userId: UserId;
      role: Role;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hogrider@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const restrict = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
          select: {
            restricted: true,
          },
        });

        if (restrict?.restricted) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );
        if (!passwordMatch) {
          return null;
        }

        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email,
          userType: existingUser.userType,
          role: existingUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log(token.email?.split("@")[0] + " token returned 🟡");

      if (user) {
        const roleData = await db.user.findFirst({
          where: {
            id: user.id,
          },
        });
        token.userId = user.id;
        token.username = user.username;
        token.userType = user.userType;
        token.userRole = roleData?.role;
        token.exp = Math.floor(Date.now() / 1000) + 10;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log(session.user.email?.split("@")[0] + "'s session created 🟢");
      return {
        ...session,
        user: {
          ...session.user,
          userId: token.userId,
          username: token.username,
          userType: token.userType,
          role: token.userRole,
        },
      };
    },
  },
};
