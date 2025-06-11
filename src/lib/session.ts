import getDb from "@/lib/db";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { cookies } from "next/headers";
import { cache } from "react";

export interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export interface User {
  id: number;
}

export async function createSession(
  token: string,
  userId: number
): Promise<Session> {
  const db = await getDb();
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  };

  await db`
    INSERT INTO user_sessions (id, user_id, expires_at)
    VALUES (${session.id}, ${session.userId}, ${session.expiresAt})
  `;
  return session;
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;

    if (token === null) {
      return { session: null, user: null };
    }

    const result = await validateSessionToken(token);
    return result;
  }
);

export async function invalidateSession(sessionId: string): Promise<void> {
  const db = await getDb();
  await db`
    DELETE FROM user_sessions
    WHERE id = ${sessionId}
  `;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const db = await getDb();
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [row] = await db`
    SELECT user_sessions.id, user_sessions.user_id, user_sessions.expires_at
    FROM user_sessions
    WHERE user_sessions.id = ${sessionId}
  `;

  if (!row) {
    return { session: null, user: null };
  }

  const session: Session = {
    id: row.id,
    userId: row.user_id,
    expiresAt: row.expires_at,
  };

  const user: User = {
    id: row.user_id,
  };

  if (Date.now() >= session.expiresAt.getTime()) {
    await db`
      DELETE FROM user_sessions
      WHERE id = ${session.id}
    `;
    return { session: null, user: null };
  }

  // if session expires in less than 10 days, extend
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 10) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db`
      UPDATE user_sessions
      SET expires_at = ${session.expiresAt}
      WHERE id = ${session.id}
    `;
  }

  return { session, user };
}
