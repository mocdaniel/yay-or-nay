"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/signup/actions";

export function SignupForm() {
  const [_, formAction, isPending] = useActionState(signupAction, {});
  return (
    <form action={formAction}>
      <label htmlFor="username">Username</label>
      <input name="username" id="username" />
      <label htmlFor="password"></label>
      <input name="password" id="password" type="password" />
      <button type="submit" disabled={isPending}>
        Submit
      </button>
    </form>
  );
}
