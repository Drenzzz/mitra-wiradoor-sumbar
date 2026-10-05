import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { sendPasswordResetEmail } from "@/lib/mail";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      verification: verificationTokens,
    },
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: (password) => bcrypt.hash(password, 12),
      verify: ({ password, hash }) => bcrypt.compare(password, hash),
    },
    sendResetPassword: async ({ user, token }) => {
      void sendPasswordResetEmail(user.email, token, user.name ?? undefined);
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "STAF"],
        required: false,
        defaultValue: "STAF",
        input: false,
      },
    },
  },
  advanced: {
    database: {
      // users.id is uuid with a DB default; let Postgres generate it.
      generateId: (options) => (options.model === "user" ? false : crypto.randomUUID()),
    },
  },
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  secret: process.env.NEXTAUTH_SECRET,
  baseURL: process.env.NEXTAUTH_URL,
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
