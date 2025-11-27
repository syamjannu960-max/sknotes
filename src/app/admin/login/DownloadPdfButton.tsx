
"use client"

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

type DownloadPdfButtonProps = {
    pdfUrl: string;
};

export function DownloadPdfButton({ pdfUrl }: DownloadPdfButtonProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Button disabled className="flex-shrink-0">
                <Download className="mr-2 h-4 w-4" />
                Download Subject PDF
            </Button>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <Button asChild className="flex-shrink-0">
            <Link href={pdfUrl} target="_blank">
                <Download className="mr-2 h-4 w-4" />
                Download Subject PDF
            </Link>
        </Button>
    );
}
