import getDb from "@/lib/db";
import type { Form } from "@/lib/types/database.types";
import { notFound } from "next/navigation";
import FeedbackForm from "@/app/feedback/[slug]/components";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const db = await getDb();

  const [form]: Form[] = await db`
    SELECT
      forms.id,
      forms.title,
      forms.description,
      forms.slug,
      forms.form_type AS type,
      forms.is_active,
      forms.created_at,
      events.id AS event_id,
      events.date AS event_date,
      events.name AS event_name
    FROM forms
    LEFT JOIN events ON forms.event_id = events.id
    WHERE forms.slug = ${slug}
  `;

  if (!form) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-8 sm:px-4">
      <div className="container mx-auto max-w-3xl px-0 sm:px-4">
        <FeedbackForm form={form} />
      </div>
    </div>
  );
}
