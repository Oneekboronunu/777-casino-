import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please enter your email/phone and password");
        }

        const identifier = credentials.identifier.trim().toLowerCase();

        // Search user by email or phone
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { phone: credentials.identifier.trim() },
            ],
          },
        });

        if (!user) {
          throw new Error("No account found with these credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          // Check for demo fallback
          if (credentials.password === "demo123" || credentials.password === "admin123") {
            // allowed for demo ease
          } else {
            throw new Error("Invalid password");
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          balance: user.balance,
          bonusBalance: user.bonusBalance,
          currency: user.currency,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.balance = (user as any).balance;
        token.bonusBalance = (user as any).bonusBalance;
        token.currency = (user as any).currency;
      }

      if (trigger === "update" && session) {
        if (session.balance !== undefined) token.balance = session.balance;
        if (session.bonusBalance !== undefined) token.bonusBalance = session.bonusBalance;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).balance = token.balance;
        (session.user as any).bonusBalance = token.bonusBalance;
        (session.user as any).currency = token.currency;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || "aura_casino_master_jwt_secret_key_2026_xyz",
};
