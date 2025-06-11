"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyFormURLButton({ url }: { url: string }) {
  function copyFormUrl() {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Form link copied to clipboard successfully.");
    });
  }

  return (
    <Button variant="outline" onClick={copyFormUrl}>
      <Copy className="mr-2 h-4 w-4" />
      Copy Link
    </Button>
  );
}
