"use server";

import getDb from "@/lib/db";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/lib/session";
import type { Event, Form } from "@/lib/types/database.types";
import { generateSlug, sanitizeFormData } from "@/lib/utils";
import { eventSchema, formSchema } from "@/lib/zod-schemas";
import { redirect } from "next/navigation";

export async function createEventAction(
  _prev: { error: string | undefined; event: Event | undefined },
  formData: FormData
): Promise<{ error: string | undefined; event: Event | undefined }> {
  const { session } = await getCurrentSession();

  if (!session) {
    return {
      error: "You must be logged in to create an event.",
      event: undefined,
    };
  }

  const validatedFormData = eventSchema.safeParse(
    Object.fromEntries(sanitizeFormData(formData))
  );

  if (!validatedFormData.success) {
    return {
      error: validatedFormData.error.message,
      event: undefined,
    };
  }

  const db = await getDb();

  const [event]: Event[] = await db`
    INSERT INTO events (name, description, date, location)
    VALUES (${validatedFormData.data.title}, ${
    validatedFormData.data.description || null
  }, ${validatedFormData.data.date || null}, ${
    validatedFormData.data.location || null
  })
  RETURNING *
  `;

  if (!event) {
    return {
      error: "Failed to create event. Please try again.",
      event: undefined,
    };
  }

  return { error: undefined, event: event };
}

export async function createFormAction(
  _prev: { error: string | undefined; form: Form | undefined },
  formData: FormData
): Promise<{ error: string | undefined; form: Form | undefined }> {
  const { session } = await getCurrentSession();

  if (!session) {
    return {
      error: "You must be logged in to create a form.",
      form: undefined,
    };
  }

  const validatedFormData = formSchema.safeParse(
    Object.fromEntries(sanitizeFormData(formData))
  );

  if (!validatedFormData.success) {
    return {
      error: validatedFormData.error.message,
      form: undefined,
    };
  }

  const { title, description, type, eventId, slug } = validatedFormData.data;

  const formattedSlug = slug ? slug.toUpperCase() : generateSlug();

  const db = await getDb();
  const [form]: Form[] = await db`
    INSERT INTO forms (event_id, title, description, form_type, slug)
    VALUES (${eventId ? parseInt(eventId, 10) : null}, ${title}, ${
    description || null
  }, ${type}, ${formattedSlug})
    RETURNING *
  `;

  if (!form) {
    return {
      error: "Failed to create form. Please try again.",
      form: undefined,
    };
  }

  return { error: undefined, form };
}

export async function logoutAction(_prev: any, _formData: FormData) {
  const { session } = await getCurrentSession();

  if (session === null) {
    console.warn("Logout despite no active session");
    return;
  }

  await invalidateSession(session.id);
  await deleteSessionTokenCookie();

  redirect("/login");
}

export async function toggleFormActive(formId: number, isActive: boolean) {
  const { session } = await getCurrentSession();

  if (!session) {
    return {
      error: "You must be logged in to toggle form status.",
    };
  }

  const db = await getDb();
  const [form]: Form[] = await db`
    UPDATE forms
    SET is_active = ${isActive},
    updated_at = NOW()
    WHERE id = ${formId}
    RETURNING *
  `;

  if (!form) {
    return {
      error: "Failed to update form status. Please try again.",
    };
  }

  return { error: undefined };
}
