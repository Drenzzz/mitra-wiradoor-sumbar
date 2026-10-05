import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { users, accounts, sessions, verificationTokens } from "./schema";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client, {
  schema: {
    ...schema,
    user: users,
    account: accounts,
    session: sessions,
    verification: verificationTokens,
  },
});
