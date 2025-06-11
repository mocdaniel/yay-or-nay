import getDb from "@/lib/db";
import type { User } from "@/lib/session";
import { hash, verify } from "@node-rs/argon2";

type UserCredentials = {
  id: number;
  passwordHash: string;
};

export async function createUser(
  username: string,
  password: string
): Promise<User> {
  const db = await getDb();
  const passwordHash = await hashPassword(password);
  const [row] = await db`
    INSERT INTO users
    (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING *
  `;

  if (!row) {
    throw new Error("Could not create user");
  }

  const user: User = {
    id: row.id,
  };

  return user;
}

export async function getUserFromUsername(
  username: string
): Promise<UserCredentials | null> {
  const db = await getDb();
  const [row] = await db`
    SELECT id, password_hash FROM users
    WHERE username = ${username}
  `;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    passwordHash: row.password_hash,
  };
}

async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function verifyHash(
  hash: string,
  password: string
): Promise<boolean> {
  return await verify(hash, password);
}
