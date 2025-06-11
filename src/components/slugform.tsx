'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'

export default function SlugForm() {
  const [slug, setSlug] = useState('')
  const [formattedSlug, setFormattedSlug] = useState('')

  function updateSlugInput(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value.replace('-', '').toUpperCase()
    setSlug(input)
    // Format the slug to lowercase and replace spaces with hyphens
    const formatted = (
      input.length > 4 ? input.slice(0, 4) + '-' + input.slice(4) : input
    ).toUpperCase()
    setFormattedSlug(formatted)
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
        <p className="text-center text-xs text-gray-500">
          Enter the 8-character code provided by the presenter
        </p>
      </div>

      <Button asChild className="w-full">
        <Link href={`/feedback/${slug}`}>Access Feedback Form</Link>
      </Button>
    </>
  )
}
