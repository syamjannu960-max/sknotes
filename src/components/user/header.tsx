import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/courses" className="flex items-center gap-2 group">
            <BookOpen className="h-8 w-8 text-primary transition-transform group-hover:rotate-[-5deg] group-hover:scale-110" />
            <span className="text-xl font-headline font-bold text-foreground group-hover:text-primary transition-colors">CourseNote</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
                <Link href="/admin">Admin Panel</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
