"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

type DownloadPdfButtonProps = {
  pdfUrl: string;
};

export function DownloadPdfButton({ pdfUrl }: DownloadPdfButtonProps) {
  return (
    <Button asChild className="flex-shrink-0">
      <Link href={pdfUrl} target="_blank">
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Link>
    </Button>
  );
}
