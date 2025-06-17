"use server";

import { getUserFromUsername, verifyHash } from "@/lib/auth";
import { createSession, generateSessionToken } from "@/lib/session";
import { loginSchema } from "@/lib/zod-schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type FormState = {
  error?: string;
};

export async function loginAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFormData = loginSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFormData.success) {
    return {
      error: validatedFormData.error.message,
    };
  }

  const user = await getUserFromUsername(validatedFormData.data.username);

  if (!user) {
    return {
      error: "Wrong username or password.",
    };
  }

  const isValidPassword = await verifyHash(
    user.passwordHash,
    validatedFormData.data.password
  );

  if (!isValidPassword) {
    return {
      error: "Wrong username or password.",
    };
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);

  const cookieStore = await cookies();
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: session.expiresAt,
    path: "/",
  });

  return redirect("/dashboard");
}
