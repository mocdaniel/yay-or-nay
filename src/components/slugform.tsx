"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SlugForm() {
  const [slug, setSlug] = useState("");
  const [formattedSlug, setFormattedSlug] = useState("");

  function updateSlugInput(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value.replace("-", "").toUpperCase();
    setSlug(input);
    // Format the slug to lowercase and replace spaces with hyphens
    const formatted = (
      input.length > 4 ? input.slice(0, 4) + "-" + input.slice(4) : input
    ).toUpperCase();
    setFormattedSlug(formatted);
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="formCode">Feedback Form Code</Label>
        <Input
          id="formCode"
          type="text"
          placeholder="ABCD-1234"
          value={formattedSlug}
          onChange={updateSlugInput}
          maxLength={9} // 8 characters + 1 dash
          className="text-center font-mono text-lg tracking-wider"
        />
        <p className="text-xs text-gray-500 text-center">
          Enter the 8-character code provided by the presenter
        </p>
      </div>

      <Button asChild className="w-full">
        <Link href={`/feedback/${slug}`}>Access Feedback Form</Link>
      </Button>
    </>
  );
}
